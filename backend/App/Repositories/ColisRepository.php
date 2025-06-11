<?php

namespace App\Repositories;

use App\Models\Colis;
use App\Models\ColisStandard;
use App\Models\ColisExpress;
use Core\Facades\RepositoryCache;
use App\Repositories\ExpediteurRepository;
use App\Repositories\LivraisonRepository;

class ColisRepository extends RepositoryCache
{
    private array $colis = [];
    private ExpediteurRepository $expediteurRepository;

    public function __construct()
    {
        parent::__construct();
        $this->expediteurRepository = new ExpediteurRepository();
    }

    public function findAllColis(): array
    {
        return array_values($this->colis);
    }

    public function findById($id): ?Colis
    {
        $data = $this->colis[$id] ?? null;

        if (is_array($data) && isset($data['expediteur'])) {
            $data['expediteur'] = $this->expediteurRepository->findById($data['expediteur']);
        }

        if (is_array($data)) {
            return $this->mapper($data);
        }

        return $data instanceof Colis ? $data : null;
    }

    public function updateColis($id, array $data): bool
    {
        if (!isset($this->colis[$id])) {
            return false;
        }

        $colis = $this->mapper($this->colis[$id]);

        if (isset($data['poids'])) {
            $colis->setPoids($data['poids']);
        }
        if (isset($data['dimensions'])) {
            $colis->setDimensions($data['dimensions']);
        }
        if (isset($data['destination'])) {
            $colis->setDestination($data['destination']);
        }
        if (isset($data['tarif'])) {
            $colis->setTarif($data['tarif']);
        }
        if (isset($data['statut'])) {
            $colis->setStatut($data['statut']);
        }

        if ($colis instanceof ColisStandard) {
            if (isset($data['delaiLivraison'])) {
                $colis->setDelaiLivraison($data['delaiLivraison']);
            }
            if (isset($data['assuranceIncluse'])) {
                $colis->setAssuranceIncluse($data['assuranceIncluse']);
            }
        } elseif ($colis instanceof ColisExpress) {
            if (isset($data['priorite'])) {
                $colis->setPriorite($data['priorite']);
            }
            if (isset($data['livraisonUrgente'])) {
                $colis->setLivraisonUrgente($data['livraisonUrgente']);
            }
        }

        $this->colis[$id] = $colis;
        $this->commit();

        return true;
    }

    public function deleteColis($id): bool
    {
        if (!isset($this->colis[$id])) {
            return false;
        }

        unset($this->colis[$id]);
        $this->commit();

        return true;
    }

    public function deleteAllColis(): bool
    {
        $this->colis = [];
        $this->commit();
        return true;
    }

    public function saveColis(Colis $colis): bool
    {
        $this->colis[$colis->getId()] = $colis;
        $this->commit();
        return true;
    }

public function findAllNotInLivraison(?array $filters, LivraisonRepository $livraisonRepository): array
{
    $allColis = $this->findAllColis();
    $livraisons = $livraisonRepository->findAll();

    $usedColisIds = [];

    foreach ($livraisons as $livraison) {
        $colisListe = $livraison->getColisListe(); 
        foreach ($colisListe as $colis) {
            $usedColisIds[] = is_object($colis) ? $colis->getId() : ($colis['id'] ?? null);
        }
    }

    $usedColisIds = array_filter(array_unique($usedColisIds));

    $colisNotInLivraison = array_filter($allColis, function ($colis) use ($usedColisIds) {
        return !in_array($colis->getId(), $usedColisIds);
    });
    if ($filters) {
        if (isset($filters['destination'])) {
            $colisNotInLivraison = array_filter($colisNotInLivraison, function ($colis) use ($filters) {
                return $colis->getDestination() === $filters['destination'];
            });
        }
    }

    return array_values($colisNotInLivraison);
}


    private function mapper(array $data): Colis
    {
        if (!isset($data['type'])) {
            throw new \Exception("Type de colis non défini dans les données.");
        }

        if (isset($data['expediteur'])) {
            $data['expediteur'] = $this->expediteurRepository->findById($data['expediteur']);
        }

        if ($data['type'] === 'standard') {
            return new ColisStandard(
                $data['id'],
                $data['poids'],
                $data['dimensions'],
                $data['destination'],
                $data['tarif'],
                $data['statut'],
                $data['delaiLivraison'] ?? null,
                $data['assuranceIncluse'] ?? false,
                $data['expediteur'] ?? null
            );
        } elseif ($data['type'] === 'express') {
            return new ColisExpress(
                $data['id'],
                $data['poids'],
                $data['dimensions'],
                $data['destination'],
                $data['tarif'],
                $data['statut'],
                $data['priorite'] ?? null,
                $data['livraisonUrgente'] ?? false,
                $data['expediteur'] ?? null
            );
        } else {
            throw new \Exception("Type de colis inconnu : " . $data['type']);
        }
    }

    protected function getData(): array
    {
        return $this->colis;
    }

    protected function setData(array $data): void
    {
        $this->colis = $data;
    }
}
