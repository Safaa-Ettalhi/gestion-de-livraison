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
    $livraison = $this->livraisonRepository->findById($id);
    if (!$livraison) {
        throw new InvalidArgumentException("Livraison not found.");
    }

    $colisIds = array_map(fn($colis) => $colis['id'], $livraison->getColisListe());

    $updatedColisListe = [];
    foreach ($colisIds as $colisId) {
        $colis = $this->colisRepository->findById($colisId);
        if ($colis) {
            $updatedColisListe[] = $colis;
        }
    }

    $livraison->setColisListe($updatedColisListe);
    $livraison->calculerMontantTotal($updatedColisListe);

    return $livraison;
}


    public function getLivraisons(?array $filters): array
{
    $livraisonsData = $this->livraisonRepository->findAll($filters);
    $livraisons = [];

    foreach ($livraisonsData as $livraisonData) {
        $colisRawList = $livraisonData['colisListe'] ?? [];
        $colisIds = array_map(fn($colis) => is_array($colis) ? $colis['id'] : $colis->getId(), $colisRawList);

        $updatedColisListe = [];
        foreach ($colisIds as $colisId) {
            $colis = $this->colisRepository->findById($colisId);
            if ($colis) {
                $updatedColisListe[] = $colis;
            }
        }

        $livraison = new Livraison(
            $livraisonData['id'],
            $livraisonData['dateExpedition'],
            $livraisonData['dateLivraisonPrevue'],
            $livraisonData['statut'],
            $livraisonData['montantTotal'],
            $updatedColisListe
        );
        $livraison->calculerMontantTotal($updatedColisListe);

        $livraisons[] = $livraison;
    }

    return array_reverse($livraisons);
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
            0,
            $colisListe
            );
            $montant = $livraison->calculerMontantTotal($colisListe);


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
        'colisListe',            
        'statut',
        'dateExpedition',
        'dateLivraisonPrevue',
    ];
    if (isset($data['colisListe']) && is_array($data['colisListe'])) {
        $colisListe = [];
        foreach ($data['colisListe'] as $colisId) {
            $colis = $this->colisRepository->findById($colisId);
            if (!$colis) {
                throw new ErrorException("Colis avec ID $colisId introuvable.");
            }
            $colisListe[] = $colis;
        }
        $data['colisListe'] = $colisListe;
    }
    
    



    $updateData = array_filter(
        $data,
        fn($key) => in_array($key, $allowedFields),
        ARRAY_FILTER_USE_KEY
    );

    if (empty($updateData)) {
        throw new \InvalidArgumentException("No valid fields provided for update.");
    }

    error_log(print_r($updateData, true));

    $this->livraisonRepository->updateLivraison($livraisonId, $updateData);

    return $this->livraisonRepository->findById($livraisonId);
}


    public function deleteLivraison(int $livraisonId): Livraison
    {
        $livraison = $this->livraisonRepository->findById($livraisonId);
        if (!$livraison) {
            throw new ErrorException("Livraison not found.");
        }

        if ($this->livraisonRepository->delete($livraisonId)) {
            return $livraison;
        }

        throw new ErrorException("Failed to delete livraison.");
    }
}
