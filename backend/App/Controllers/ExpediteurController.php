<?php
namespace App\Controllers;

use Core\Controller;
use Core\Decorators\Route;
use Core\Router\RouteMethod;
use App\Services\Implementations\ExpediteurDefault;
use App\Services\Interfaces\ExpediteurService;
use Core\Decorators\Description;

#[Route('/api/v1/expediteurs')]
class ExpediteurController extends Controller
{
    private ExpediteurService $expediteurService;

    public function __construct()
    {
        parent::__construct();
        $this->expediteurService = new ExpediteurDefault();
    }

    #[Route('{expediteurId}', method: RouteMethod::GET)]
    #[Description("Récupérer un expéditeur par son identifiant.")]
    public function getExpediteur($expediteurId)
    {
        try {
            $expediteur = $this->expediteurService->getExpediteur((int)$expediteurId);
            return $this->json($expediteur);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }
    }

    #[Route('', method: RouteMethod::GET)]
    #[Description("Récupérer tous les expéditeurs.")]
    public function getAllExpediteurs()
    {
        try {
            $filters = $this->request->input('filters', null);
            $expediteurs = $this->expediteurService->getExpediteurs($filters);
            return $this->json($expediteurs);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('', method: RouteMethod::POST)]
    #[Description("Créer un nouvel expéditeur.")]
    public function createExpediteur()
    {
        try {
            $data = $this->request->all();
            
            $expediteur = $this->expediteurService->createExpediteur(
                $data['nom'] ?? null,
                $data['email'] ?? null,
                $data['phone'] ?? null,
                $data['adresse'] ?? null
            );

            /*
            dummy json
            {
                "name": "sa faa",
                "email": "yes@yess.com",
                "phone": "1234567890",
                "adresse": "123 safi, Morocco"
            }
            */

            return $this->json($expediteur, 201);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    #[Route('{expediteurId}', method: RouteMethod::PUT)]
    #[Description("Mettre à jour un expéditeur existant.")]
    public function updateExpediteur($expediteurId)
    {
        try {
            $data = $this->request->all();
            $updatedExpediteur = $this->expediteurService->updateExpediteur((int)$expediteurId, $data);
            return $this->json($updatedExpediteur);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    #[Route('{expediteurId}', method: RouteMethod::DELETE)]
    #[Description("Supprimer un expéditeur.")]
    public function deleteExpediteur($expediteurId)
    {
        try {
            $deletedExpediteur = $this->expediteurService->deleteExpediteur((int)$expediteurId);
            return $this->json($deletedExpediteur);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }
}
