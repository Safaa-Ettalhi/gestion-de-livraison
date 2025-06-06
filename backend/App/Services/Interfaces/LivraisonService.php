<?php
namespace App\Services\Interfaces;

use App\Models\Livraison;

interface LivraisonService
{
    public function getLivraison(int $id): Livraison;

    public function getLivraisons(?array $filters): array;

   public function createLivraison(array $colisIds, string $dateExpedition, string $dateLivraisonPrevue, string $statut = Livraison::STATUT_EN_COURS): Livraison;

    public function updateLivraison(int $livraisonId, array $data): Livraison;

    public function deleteLivraison(int $livraisonId): Livraison;
}
