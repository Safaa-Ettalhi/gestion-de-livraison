<?php
namespace App\Services\Implementations;

use App\Models\Colis;
use App\Repositories\ColisRepository;
use App\Repositories\LivraisonRepository;
use App\Repositories\ExpediteurRepository;
use App\Models\Expediteur;
use App\Services\Interfaces\ColisService;
use ErrorException;
use App\Models\ColisStandard;
use App\Models\ColisExpress;


class ColisDefault implements ColisService
{
    public function __construct(
        private ColisRepository $colisRepository = new ColisRepository(),
        private LivraisonRepository $livraisonRepository = new LivraisonRepository(),
        private ExpediteurRepository $expediteurRepository = new ExpediteurRepository()
    ) {}

    public function getColis(int $id): Colis
    {
        $colis = $this->colisRepository->findById($id);
        if (!$colis) {
            throw new ErrorException("Colis not found.");
        }
        return $colis;
    }

    public function getAllColis(?array $filters): array
    {
        return $this->colisRepository->findAllColis();
    }
    
    public function getAllUsedColis(?array $filters = null, ?string $skip = ""): array
{
    $allUsedColis = [];
    $processedColisIds = [];
    
    $allLivraisons = array_filter(
        $this->livraisonRepository->findAll(),
        function ($livraison) use ($skip) {
            $livraisonId = is_array($livraison) ? ($livraison['id'] ?? null) : $livraison->getId();            
            return (string)$livraisonId != (string)$skip;
        }
    );

    foreach ($allLivraisons as $livraison) {
        $colisListForLivraison = is_array($livraison)
            ? ($livraison['colisListe'] ?? [])
            : ($livraison->colisListe ?? $livraison->getColisListe());

        if (!is_iterable($colisListForLivraison)) {
            continue;
        }

        foreach ($colisListForLivraison as $colis) {
            $colisId = is_array($colis) ? ($colis['id'] ?? null) : $colis->getId();

            if ($colisId && !isset($processedColisIds[$colisId])) {
                $processedColisIds[$colisId] = true;
                $colisObj = is_object($colis) ? $colis : $this->colisRepository->findById($colisId);

                if ($colisObj instanceof Colis) {
                    $allUsedColis[] = $colisObj;
                }
            }
        }
    }
    if ($filters) {
        if (isset($filters['destination'])) {
            $allUsedColis = array_filter($allUsedColis, fn($colis) => $colis->getDestination() === $filters['destination']);
        }
    }

    return array_values($allUsedColis);
}

    public function getAllColisNotUsedInLivraison(?array $filters = null, ?string $skip = ""): array
    {
        $usedColisIds = [];
        $allUsedColisObjects = $this->getAllUsedColis($filters, strtolower($skip)); 
        foreach ($allUsedColisObjects as $colis) {
            $usedColisIds[] = is_array($colis) ? $colis['id'] : $colis->getId();
        }

        $allColis = $this->colisRepository->findAllColis($filters);

        $notUsedColis = [];
        foreach ($allColis as $colis) {
            $colisId = is_array($colis) ? $colis['id'] : $colis->getId();
            if (!in_array($colisId, $usedColisIds)) {
                $notUsedColis[] = $colis;
            }
        }

        return $notUsedColis;
    }





public function createColis(array $data): Colis
{
    $type = $data['type'] ?? null;
    if (!$type) {
        throw new \InvalidArgumentException("Le champ 'type' est obligatoire (standard | express).");
    }
    $id = abs(crc32(uniqid()));
    $poids       = $data['poids']        ?? 0;
    $dimensions  = $data['dimensions']   ?? '';
    $destination = $data['destination']  ?? '';
    $tarif       = $data['tarif']        ?? 0;
    $statut      = $data['statut']       ?? 'en attente';
    $expediteur = $data['expediteur'] ?? false;

    if ($expediteur) {
        $expediteur = $this->expediteurRepository->findById($expediteur);
    }
    

    if ($type === 'standard') {
        $colis = new ColisStandard(
            $id,
            $poids,
            $dimensions,
            $destination,
            $tarif,
            $statut,
            $data['delaiLivraison']    ?? '',
            $data['assuranceIncluse']  ?? false,
            $expediteur
        );
    } elseif ($type === 'express') {
        $colis = new ColisExpress(
            $id,
            $poids,
            $dimensions,
            $destination,
            $tarif,
            $statut,
            $data['priorite']          ?? '',
            $data['livraisonUrgente']  ?? false,
            $expediteur
        );
    } else {
        throw new \InvalidArgumentException("Type de colis inconnu : $type");
    }


    $this->colisRepository->saveColis($colis);
    return $colis;
}


 
    public function updateColis(int $colisId, array $data): Colis
{
    $colis = $this->colisRepository->findById($colisId);
    if (!$colis) {
        throw new ErrorException("Colis not found.");
    }

    $allowedFields = [
        'description', 'poids', 'expediteurId', 'dimensions', 'destination', 'tarif', 'statut', 'type',
        'delaiLivraison', 'assuranceIncluse',
        'priorite', 'livraisonUrgente'
    ];

    $updateData = array_filter(
        $data,
        fn($key) => in_array($key, $allowedFields),
        ARRAY_FILTER_USE_KEY
    );

    if (empty($updateData)) {
        throw new \InvalidArgumentException("No valid fields provided for update.");
    }

    $this->colisRepository->updateColis($colisId, $updateData);

    return $this->colisRepository->findById($colisId);
}


    public function deleteColis(int $colisId): Colis
    {
        $colis = $this->colisRepository->findById($colisId);
        if (!$colis) {
            throw new ErrorException("Colis not found.");
        }

        if ($this->colisRepository->deleteColis($colisId)) {
            return $colis;
        }

        throw new ErrorException("Failed to delete colis.");
    }

    public function deleteAllColis(): void
    {
        $this->colisRepository->deleteAllColis();
    }
}
