<?php
namespace App\Services\Implementations;

use App\Models\Colis;
use App\Repositories\ColisRepository;
use App\Services\Interfaces\ColisService;
use ErrorException;
use App\Models\ColisStandard;
use App\Models\ColisExpress;


class ColisDefault implements ColisService
{
    public function __construct(
        private ColisRepository $colisRepository = new ColisRepository()
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

    if ($type === 'standard') {
        $colis = new ColisStandard(
            $id,
            $poids,
            $dimensions,
            $destination,
            $tarif,
            $statut,
            $data['delaiLivraison']    ?? '',
            $data['assuranceIncluse']  ?? false
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
            $data['livraisonUrgente']  ?? false
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
}
