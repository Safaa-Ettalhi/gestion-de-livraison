<?php
namespace App\Services\Implementations;

use App\Models\Livraison;
use App\Repositories\LivraisonRepository;
use App\Services\Interfaces\LivraisonService;
use ErrorException;
use App\Repositories\ColisRepository;

class LivraisonDefault implements LivraisonService
{
    private LivraisonRepository $livraisonRepository;
    private ColisRepository $colisRepository;
      public function __construct()
    {
        $this->livraisonRepository = new LivraisonRepository();
        $this->colisRepository = new ColisRepository();
    }

    public function getLivraison(int $id): Livraison
    {
        error_log(print_r($this->livraisonRepository, true));
        $livraison = $this->livraisonRepository->findById($id);
        if (!$livraison) {
            throw new ErrorException("Livraison not found.");
        }
        return $livraison;
    }

    public function getLivraisons(?array $filters): array
    {

        return $this->livraisonRepository->findAll();
    }

  
 public function createLivraison(array $colisIds, string $dateExpedition, string $dateLivraisonPrevue, string $statut = Livraison::STATUT_EN_COURS): Livraison
    {
        $colisListe = [];
        foreach ($colisIds as $id) {
            $colis = $this->colisRepository->findById($id);  
            if (!$colis) {
                throw new ErrorException("Colis avec ID $id introuvable.");
            }
            $colisListe[] = $colis;
        }

        $livraison = new Livraison(
            abs(crc32(uniqid())),
            $dateExpedition,
            $dateLivraisonPrevue,
            $statut,
            $colisListe
        );

        $livraison->calculerMontantTotal($colisListe);

        $this->livraisonRepository->save($livraison, $colisIds);

        return $livraison;
    }




 public function updateLivraison(int $livraisonId, array $data): Livraison
{
    $livraison = $this->livraisonRepository->findById($livraisonId);
    if (!$livraison) {
        throw new ErrorException("Livraison not found.");
    }
    $allowedFields = [
        'colisIds',            
        'statut',
        'dateExpedition',
        'dateLivraisonPrevue',
        
    ];

    $updateData = array_filter(
        $data,
        fn($key) => in_array($key, $allowedFields),
        ARRAY_FILTER_USE_KEY
    );

    if (empty($updateData)) {
        throw new \InvalidArgumentException("No valid fields provided for update.");
    }

    if (isset($updateData['colisIds'])) {
        foreach ($updateData['colisIds'] as $colisId) {
            $colis = $this->colisRepository->findById($colisId);
            if (!$colis) {
                throw new ErrorException("Colis avec ID $colisId introuvable.");
            }
        }
    }

    $this->livraisonRepository->updateLivraison($livraisonId, $updateData);

    return $this->livraisonRepository->findById($livraisonId);
}


    public function deleteLivraison(int $livraisonId): Livraison
    {
        $livraison = $this->livraisonRepository->findById($livraisonId);
        if (!$livraison) {
            throw new ErrorException("Livraison not found.");
        }

        if ($this->livraisonRepository->deleteLivraison($livraisonId)) {
            return $livraison;
        }

        throw new ErrorException("Failed to delete livraison.");
    }
}
