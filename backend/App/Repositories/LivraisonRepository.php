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
    $livraison = $this->findById($livraisonId);
    if (!$livraison) {
        throw new \ErrorException("Livraison not found.");
    }
    if (isset($data['dateExpedition'])) {
        $livraison->setDateExpedition($data['dateExpedition']);
    }

    if (isset($data['dateLivraisonPrevue'])) {
        $livraison->setDateLivraisonPrevue($data['dateLivraisonPrevue']);
    }

    if (isset($data['statut'])) {
        $livraison->setStatut($data['statut']);
    }

    if (isset($data['colisIds']) && is_array($data['colisIds'])) {
        $colisListe = [];
        foreach ($data['colisIds'] as $colisId) {
            $colis = $this->colisRepository->findById($colisId);
            if (!$colis) {
                throw new \ErrorException("Colis avec ID $colisId introuvable.");
            }
            $colisListe[] = $colis;
        }
        $livraison->calculerMontantTotal($colisListe);
    }
    $this->save($livraison);

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

    // log $data for debugging
    // error_log(print_r($data, true));

    $livraison = new Livraison(
        $data['id'] ?? null,
        $data['dateExpedition'] ?? null,
        $data['dateLivraisonPrevue'] ?? null,
        $data['statut'] ?? null,
        $data['montantTotal'] ?? 0,
        $colisListe
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