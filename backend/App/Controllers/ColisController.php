<?php
namespace App\Controllers;

use Core\Controller;
use Core\Decorators\Route;
use Core\Router\RouteMethod;
use App\Services\Implementations\ColisDefault;
use App\Services\Interfaces\ColisService;
use Core\Decorators\Description;

#[Route('/api/v1/colis')]
class ColisController extends Controller
{
    private ColisService $colisService;

    public function __construct()
    {
        parent::__construct();
        $this->colisService = new ColisDefault();
    }

    #[Route('{colisId}', method: RouteMethod::GET)]
    #[Description("Récupérer un colis par son identifiant.")]
    public function getColis($colisId)
    {
        try {
            $colis = $this->colisService->getColis((int)$colisId);

            
            return $this->json($colis);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }
    }

    #[Route('', method: RouteMethod::GET)]
    #[Description("Récupérer tous les colis.")]
    public function getAllColis()
    {
        try {
            $filters = $this->request->input('filters', null);
            $colisList = $this->colisService->getAllColisNotUsedInLivraison($filters);
            return $this->json($colisList);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('', method: RouteMethod::POST)]
    #[Description("Créer un nouveau colis.")]
    public function createColis()
{
    $requestBody = file_get_contents('php://input');
    $data = json_decode($requestBody, true);

    if (!isset($data['type'])) {
        http_response_code(400);
        echo json_encode(['error' => "Le champ 'type' est obligatoire (standard | express)."]);
        return;
    }

    // Validation des données
    if (!in_array($data['type'], ['standard', 'express'])) {
        http_response_code(400);
        echo json_encode(['error' => "Type de colis invalide : {$data['type']}"]);
        return;
    }

    if (empty($data['expediteur'])) {
        http_response_code(400);
        echo json_encode(['error' => "Le champ 'expediteur' est obligatoire."]);
        return;
    }

    if (empty($data['poids']) || !is_numeric($data['poids'])) {
        http_response_code(400);
        echo json_encode(['error' => "Le champ 'poids' est obligatoire et doit être un nombre."]);
        return;
    }

    if (empty($data['dimensions'])) {
        http_response_code(400);
        echo json_encode(['error' => "Le champ 'dimensions' est obligatoire."]);
        return;
    }


    if (empty($data['destination'])) {
        http_response_code(400);
        echo json_encode(['error' => "Le champ 'destination' est obligatoire."]);
        return;
    }


    if (empty($data['tarif']) || !is_numeric($data['tarif'])) {
        http_response_code(400);
        echo json_encode(['error' => "Le champ 'tarif' est obligatoire et doit être un nombre."]);
        return;
    }

    if (empty($data['statut'])) {
        http_response_code(400);
        echo json_encode(['error' => "Le champ 'statut' est obligatoire."]);
        return;
    }

    


    $colisData = [
        'expediteur'      => $data['expediteur']      ?? null,
        'poids'             => $data['poids']             ?? 0,
        'dimensions'        => $data['dimensions']        ?? '',
        'destination'       => $data['destination']       ?? '',
        'tarif'             => $data['tarif']             ?? 0,
        'statut'            => $data['statut']            ?? 'en attente',
        'type'              => $data['type'],
    ];

   
    if ($data['type'] === 'standard') {
        $colisData['delaiLivraison']    = $data['delaiLivraison']    ?? '';
        $colisData['assuranceIncluse']  = $data['assuranceIncluse']  ?? false;
    } elseif ($data['type'] === 'express') {
        $colisData['priorite']          = $data['priorite']          ?? '';
        $colisData['livraisonUrgente']  = $data['livraisonUrgente']  ?? false;
    } else {
        http_response_code(400);
        echo json_encode(['error' => "Type de colis invalide : {$data['type']}"]);
        return;
    }

    try {
        $colis = $this->colisService->createColis($colisData);
        return $this->json($colis, 201);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}


    #[Route('{colisId}', method: RouteMethod::PUT)]
    #[Description("Mettre à jour un colis existant.")]
    public function updateColis($colisId)
    {
        try {
            $data = $this->request->all();
            $updatedColis = $this->colisService->updateColis((int)$colisId, $data);
            return $this->json($updatedColis);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    #[Route('{colisId}', method: RouteMethod::DELETE)]
    #[Description("Supprimer un colis.")]
    public function deleteColis($colisId)
    {
        try {
            $deletedColis = $this->colisService->deleteColis((int)$colisId);
            return $this->json($deletedColis);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    #[Route('deleteAll', method: RouteMethod::DELETE)]
    #[Description("Supprimer tous les colis.")]
    public function deleteAllColis()
    {
        try {
            $deletedCount = $this->colisService->deleteAllColis();
            return $this->json(['deletedCount' => $deletedCount]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

}
