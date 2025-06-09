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

    
    
    public function findById($expeditor): ?Expediteur
{
    if (is_array($expeditor)) {
        $id = $expeditor['id'] ?? null;
    } elseif ($expeditor instanceof Expediteur) {
        $id = $expeditor->getId(); 
    } else {
        $id = $expeditor; 
    }

    if ($id === null) {
        return null;
    }

    $data = $this->expediteurs[$id] ?? null;

    if (is_array($data)) {
        return $this->mapper($data);
    }

    return $data instanceof Expediteur ? $data : null;
}

    
    public function findByPhone(string $phone): ?Expediteur
{
    foreach ($this->expediteurs as $data) {
        if (is_array($data)) {
            $expediteur = $this->mapper($data);
        } elseif ($data instanceof Expediteur) {
            $expediteur = $data;
        } else {
            continue;
        }
        if ($this->normalizePhone($expediteur->getPhone()) === $this->normalizePhone($phone)) {
            return $expediteur;
        }
    }
    
    return null;
}



private function normalizePhone(string $phone): string
{
    return preg_replace('/\s+/', '', $phone);
}


public function findByEmail(string $email): ?Expediteur
{
    foreach ($this->expediteurs as $data) {
        if (is_array($data)) {
            $expediteur = $this->mapper($data);
        } elseif ($data instanceof Expediteur) {
            $expediteur = $data;
        } else {
            continue;
        }
        if ($expediteur->getEmail() == $email) {
            return $expediteur;
        }
    }
    return null;
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

    public function deleteAll(): bool
    {
        $this->expediteurs = [];
        $this->commit();
        return true;
    }

    private function mapper(array $data): Expediteur
    {
        return new Expediteur(
            $data['id'],
            $data['nom'],
            $data['email'],
            $data['phone'],
            $data['adresse'],
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
