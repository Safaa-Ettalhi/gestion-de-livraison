<?php
namespace App\Models;

class ColisExpress extends Colis
{
    private $priorite;
    private $livraisonUrgente;

    public function __construct($id, $poids, $dimensions, $destination, $tarif, $statut, $priorite, $livraisonUrgente , $expediteur)
    {
        parent::__construct($id, $poids, $dimensions, $destination, $tarif, $statut, $expediteur);
        $this->priorite = $priorite;
        $this->livraisonUrgente = $livraisonUrgente;
    }

    public function getType()
    {
        return 'express';
    }

    public function getPriorite()
    {
        return $this->priorite;
    }

    public function setPriorite($priorite)
    {
        $this->priorite = $priorite;
    }

    public function isLivraisonUrgente()
    {
        return $this->livraisonUrgente;
    }

    public function setLivraisonUrgente($livraisonUrgente)
    {
        $this->livraisonUrgente = $livraisonUrgente;
    }

    public function jsonSerialize(): array
    {
        return array_merge(parent::jsonSerialize(), [
            'priorite' => $this->priorite,
            'livraisonUrgente' => $this->livraisonUrgente,
        ]);
    }
public function calculerMontant()
{
    $montant = $this->poids * $this->tarif;
    $montant += 2;
    if ($this->livraisonUrgente) {
        $montant += 5;
    }

    return $montant;
}

}

