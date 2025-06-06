<?php
namespace App\Services\Implementations;

use App\Models\Expediteur;
use App\Repositories\ExpediteurRepository;
use App\Services\Interfaces\ExpediteurService;
use ErrorException;

class ExpediteurDefault implements ExpediteurService
{
    public function __construct(private ExpediteurRepository $expediteurRepository = new ExpediteurRepository())
    {
    }

    public function getExpediteur(int $id): Expediteur
    {
        $expediteur = $this->expediteurRepository->findById($id);
        if (!$expediteur) {
            throw new ErrorException("Expéditeur non trouvé.");
        }
        return $expediteur;
    }

    public function getExpediteurs(?array $filters): array
    {
        return $this->expediteurRepository->findAll();
    }

    public function createExpediteur(string $nom, string $email, string $telephone, string $adresse): Expediteur
    {
        $expediteur = new Expediteur(abs(crc32(uniqid())), $nom, $email, $telephone, $adresse);
        if ($this->expediteurRepository->save($expediteur)) {
            return $expediteur;
        }
        throw new ErrorException("Impossible de créer l'expéditeur.");
    }

    public function updateExpediteur(int $id, array $data): Expediteur
    {
        $expediteur = $this->expediteurRepository->findById($id);
        if (!$expediteur) {
            throw new ErrorException("Expéditeur non trouvé.");
        }

        $this->expediteurRepository->update($id, $data);
        return $this->expediteurRepository->findById($id);
    }

    public function deleteExpediteur(int $id): Expediteur
    {
        $expediteur = $this->expediteurRepository->findById($id);
        if (!$expediteur) {
            throw new ErrorException("Expéditeur non trouvé.");
        }

        if ($this->expediteurRepository->delete($id)) {
            return $expediteur;
        }

        throw new ErrorException("Impossible de supprimer l'expéditeur.");
    }
}
