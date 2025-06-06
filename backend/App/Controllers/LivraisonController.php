<?php
namespace App\Controllers;

use Core\Controller;
use Core\Decorators\Route;
use Core\Router\RouteMethod;
use App\Services\Implementations\LivraisonDefault;
use App\Services\Interfaces\LivraisonService;
use Core\Decorators\Description;

#[Route('/api/v1/livraisons')]
class LivraisonController extends Controller
{
    private LivraisonService $livraisonService;

    public function __construct()
    {
        parent::__construct();
        $this->livraisonService = new LivraisonDefault();
    }

    #[Route('{livraisonId}', method: RouteMethod::GET)]
    #[Description("Récupérer une livraison par son identifiant.")]
    public function getLivraison($livraisonId)
    {
        try {
            $livraison = $this->livraisonService->getLivraison((int)$livraisonId);
            return $this->json($livraison);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }
    }

    #[Route('', method: RouteMethod::GET)]
    #[Description("Récupérer toutes les livraisons.")]
    public function getAllLivraisons()
    {
        try {
            $filters = $this->request->input('filters', null);
            $livraisons = $this->livraisonService->getLivraisons($filters);
            return $this->json($livraisons);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('', method: RouteMethod::POST)]
    #[Description("Créer une nouvelle livraison.")]
   public function createLivraison()
{
    try {
        $data = $this->request->all();

        $colisIds = $data['colisIds'] ?? null;  
        $dateExpedition = $data['dateExpedition'] ?? null;
        $dateLivraisonPrevue = $data['dateLivraisonPrevue'] ?? null;
        $statut = $data['statut'] ?? \App\Models\Livraison::STATUT_EN_COURS;

        if (!is_array($colisIds) || !$dateExpedition || !$dateLivraisonPrevue) {
            return $this->json(['error' => 'Données invalides ou manquantes'], 400);
        }

        $livraison = $this->livraisonService->createLivraison(
            $colisIds,
            $dateExpedition,
            $dateLivraisonPrevue,
            $statut
        );

        return $this->json($livraison, 201);

    } catch (\Exception $e) {
        return $this->json(['error' => $e->getMessage()], 400);
    }
}


    #[Route('{livraisonId}', method: RouteMethod::PUT)]
    #[Description("Mettre à jour une livraison existante.")]
    public function updateLivraison($livraisonId)
    {
        try {
            $data = $this->request->all();
            $updatedLivraison = $this->livraisonService->updateLivraison((int)$livraisonId, $data);
            return $this->json($updatedLivraison);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    #[Route('{livraisonId}', method: RouteMethod::DELETE)]
    #[Description("Supprimer une livraison.")]
    public function deleteLivraison($livraisonId)
    {
        try {
            $deletedLivraison = $this->livraisonService->deleteLivraison((int)$livraisonId);
            return $this->json($deletedLivraison);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }
}
