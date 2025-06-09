<?php
namespace App\Models;

use JsonSerializable;

abstract class Colis implements JsonSerializable
{
    protected $id;
    protected $poids;
    protected $dimensions;
    protected $destination;
    protected $tarif;
    protected $statut= self::EN_ATTENTE;
    protected $expediteur;
    public const EN_ATTENTE = 'EN_ATTENTE';
    public const EN_COURS = 'EN_COURS';
    public const LIVRE = 'LIVRE';
    public const ANNULE = 'ANNULE';

    public function __construct($id, $poids, $dimensions, $destination, $tarif, $statut, $expediteur)
    {
        $this->id = $id;
        $this->poids = $poids;
        $this->dimensions = $dimensions;
        $this->destination = $destination;
        $this->tarif = $tarif;
        $this->statut = $statut;
        $this->expediteur = $expediteur;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'poids' => $this->poids,
            'dimensions' => $this->dimensions,
            'destination' => $this->destination,
            'tarif' => $this->tarif,
            'statut' => $this->statut,
            'type' => $this->getType(),
            'expediteur' => $this->expediteur
        ];
    }

    
    abstract public function getType();

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getPoids()
    {
        return $this->poids;
    }

    public function setPoids($poids)
    {
        $this->poids = $poids;
    }

    public function getDimensions()
    {
        return $this->dimensions;
    }

    public function setDimensions($dimensions)
    {
        $this->dimensions = $dimensions;
    }

    public function getDestination()
    {
        return $this->destination;
    }

    public function setDestination($destination)
    {
        $this->destination = $destination;
    }

    public function getTarif()
    {
        return $this->tarif;
    }

    public function setTarif($tarif)
    {
        $this->tarif = $tarif;
    }

    public function getStatut()
    {
        return $this->statut;
    }

    public function setStatut($statut)
    {
        $this->statut = $statut;
    }
}