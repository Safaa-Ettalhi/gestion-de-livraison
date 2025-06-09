<?php

namespace App\Repositories;

use App\Models\Livraison;
use Core\Facades\RepositoryCache;

class LivraisonRepository extends RepositoryCache
{
    private array $livraisons = [];

    public function __construct()
    {
        parent::__construct();
    }

    public function findAll(): array
    {
        return array_values($this->livraisons);
    }

    public function deleteAll(): void
    {
        $this->livraisons = [];
        $this->commit();
    }   

    public function getColisListe(): array
    {
        $colisListe = [];
        foreach ($this->livraisons as $livraison) {
            if ($livraison instanceof Livraison) {
                $colisListe = array_merge($colisListe, $livraison->getColisListe());
            }
        }
        return $colisListe;
    }

    public function findById($id): ?Livraison
    {
        $data = $this->livraisons[$id] ?? null;
        if (is_array($data)) {
            return $this->mapper($data);
        }

        return $data instanceof Livraison ? $data : null;
    }

    public function save(Livraison $livraison): bool
    {
        $this->livraisons[$livraison->getId()] = $livraison;
        $this->commit();
        return true;
    }

public function updateLivraison(int $livraisonId, array $data): Livraison
{
    if (!isset($this->livraisons[$livraisonId])) {
        throw new \Exception("Livraison with ID $livraisonId not found.");
    }

    $livraison = $this->mapper($this->livraisons[$livraisonId]);

    if (isset($data['dateExpedition'])) {
        $livraison->setDateExpedition($data['dateExpedition']);
    }
    if (isset($data['dateLivraisonPrevue'])) {
        $livraison->setDateLivraisonPrevue($data['dateLivraisonPrevue']);
    }
    if (isset($data['statut'])) {
        $livraison->setStatut($data['statut']);
    }
    if (isset($data['montantTotal'])) {
        $livraison->setMontantTotal($data['montantTotal']);
    }

    if (isset($data['colisListe']) && is_array($data['colisListe'])) {
        $livraison->setColisListe($data['colisListe']);
    }

    if (isset($data['colisListe'])) {
        $livraison->calculerMontantTotal($data['colisListe']);
    }


    $this->livraisons[$livraisonId] = $livraison;
    $this->commit();

    return $livraison;
}



    public function delete($id): bool
    {
        if (!isset($this->livraisons[$id])) {
            return false;
        }

        unset($this->livraisons[$id]);
        $this->commit();
        return true;
    }

private function mapper(array $data): Livraison
{
    $colisListe = [];
    if (isset($data['colis']) && is_array($data['colis'])) {
        foreach ($data['colis'] as $colisData) {
            $colisListe[] = $colisData; 
        }
    }


    $livraison = new Livraison(
        $data['id'] ?? null,
        $data['dateExpedition'] ?? null,
        $data['dateLivraisonPrevue'] ?? null,
        $data['statut'] ?? null,
        $data['montantTotal'] ?? 0,
        $data['colisListe'] ?? $colisListe
    );

    return $livraison;
}

    protected function getData(): array
    {
        return $this->livraisons;
    }

    protected function setData(array $data): void
    {
        $this->livraisons = $data;
    }
}