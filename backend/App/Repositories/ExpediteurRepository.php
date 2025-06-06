<?php

namespace App\Repositories;

use App\Models\Expediteur;
use Core\Facades\RepositoryCache;

class ExpediteurRepository extends RepositoryCache
{
    private array $expediteurs = [];

    public function __construct()
    {
        parent::__construct();
    }

    public function findAll(): array
    {
        return array_values($this->expediteurs);
    }

    public function findById($id): ?Expediteur
    {
        $data = $this->expediteurs[$id] ?? null;
        if (is_array($data)) {
            return $this->mapper($data);
        }

        return $data instanceof Expediteur ? $data : null;
    }

    public function save(Expediteur $expediteur): bool
    {
        $this->expediteurs[$expediteur->getId()] = $expediteur;
        $this->commit();
        return true;
    }

    public function update($id, array $data): bool
    {
        if (!isset($this->expediteurs[$id])) {
            return false;
        }

        $expediteur = $this->mapper($this->expediteurs[$id]);

        if (isset($data['nom'])) {
            $expediteur->setNom($data['nom']);
        }

        if (isset($data['adresse'])) {
            $expediteur->setAdresse($data['adresse']);
        }

        if (isset($data['phone'])) {
            $expediteur->setPhone($data['phone']);
        }

        if (isset($data['email'])) {
            $expediteur->setEmail($data['email']);
        }


        $this->expediteurs[$id] = $expediteur;
        $this->commit();

        return true;
    }

    public function delete($id): bool
    {
        if (!isset($this->expediteurs[$id])) {
            return false;
        }

        unset($this->expediteurs[$id]);
        $this->commit();

        return true;
    }

    private function mapper(array $data): Expediteur
    {
        return new Expediteur(
            $data['id'],
            $data['nom'],
            $data['adresse'],
            $data['phone'],
            $data['email']
        );
    }

    protected function getData(): array
    {
        return $this->expediteurs;
    }

    protected function setData(array $data): void
    {
        $this->expediteurs = $data;
    }
}
