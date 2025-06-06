<?php
namespace App\Services\Interfaces;

use App\Models\Expediteur;

interface ExpediteurService
{
    public function getExpediteur(int $id): Expediteur;

    public function getExpediteurs(?array $filters): array;

    public function createExpediteur(string $nom, string $email, string $telephone, string $adresse): Expediteur;

    public function updateExpediteur(int $id, array $data): Expediteur;

    public function deleteExpediteur(int $id): Expediteur;
}
