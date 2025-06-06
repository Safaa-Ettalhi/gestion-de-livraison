<?php
namespace App\Services\Interfaces;

use App\Models\Colis;

interface ColisService
{
    public function getColis(int $id): Colis;

    public function getAllColis(?array $filters): array;

   public function createColis(array $data): Colis ;


    public function updateColis(int $colisId, array $data): Colis;

    public function deleteColis(int $colisId): Colis;
}
