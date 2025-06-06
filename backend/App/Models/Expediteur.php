<?php
namespace App\Models;

use JsonSerializable;

class Expediteur implements JsonSerializable
{
    private $id;
    private $nom;
    private $email;
    private $phone;
    private $adresse;

    public function __construct($id, $nom, $email, $phone, $adresse)
    {
        $this->id = $id;
        $this->nom = $nom;
        $this->email = $email;
        $this->phone = $phone;
        $this->adresse = $adresse;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'email' => $this->email,
            'phone' => $this->phone,
            'adresse' => $this->adresse,
        ];
    }


    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getNom()
    {
        return $this->nom;
    }

    public function setNom($nom)
    {
        $this->nom = $nom;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function getPhone()
    {
        return $this->phone;
    }

    public function setPhone($phone)
    {
        $this->phone = $phone;
    }

    public function getAdresse()
    {
        return $this->adresse;
    }

    public function setAdresse($adresse)
    {
        $this->adresse = $adresse;
    }
}
