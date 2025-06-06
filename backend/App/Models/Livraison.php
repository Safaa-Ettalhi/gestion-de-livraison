<?php
namespace App\Models;

use JsonSerializable;

class Livraison implements JsonSerializable
{
    private $id;
    private $dateExpedition;
    private $dateLivraisonPrevue;
    private $colisListe;
    private $montantTotal = 0;
    private $statut = self::STATUT_EN_COURS;


    // Statuts possibles
    public const STATUT_EN_COURS = 'EN_COURS';
    public const STATUT_LIVREE = 'LIVREE';
    public const STATUT_ANNULEE = 'ANNULEE';

    public function __construct($id, $dateExpedition, $dateLivraisonPrevue, $statut , $montantTotal, $colisListe)
    {
        $this->id = $id;
        $this->dateExpedition = $dateExpedition;
        $this->dateLivraisonPrevue = $dateLivraisonPrevue;
        $this->statut = $statut;
        $this->montantTotal = $montantTotal;
        $this->colisListe = $colisListe;
    }

    public function jsonSerialize(): array
    {
        
        return [
            'id' => $this->id,
            'dateExpedition' => $this->dateExpedition,
            'dateLivraisonPrevue' => $this->dateLivraisonPrevue,
            'montantTotal' => $this->montantTotal,
            'statut' => $this->statut,
            'colisListe' => $this->colisListe,
        ];
    }

    public function getId()
    {
        return $this->id;
    }


    public function getDateExpedition()
    {
        return $this->dateExpedition;
    }

    public function setDateExpedition($dateExpedition)
    {
        $this->dateExpedition = $dateExpedition;
    }

    public function getDateLivraisonPrevue()
    {
        return $this->dateLivraisonPrevue;
    }

    public function setDateLivraisonPrevue($dateLivraisonPrevue)
    {
        $this->dateLivraisonPrevue = $dateLivraisonPrevue;
    }

    public function getMontantTotal()
    {
        return $this->montantTotal;
    }

    private function setMontantTotal($montantTotal)
    {
        $this->montantTotal = $montantTotal;
    }

    public function getStatut()
    {
        return $this->statut;
    }

    public function setStatut($statut)
    {
        $this->statut = $statut;
    }

    // setcolisListe 
    public function setColisListe(array $colisListe)
    {
        $this->colisListe = $colisListe;
    }

    public function calculerMontantTotal(array $colisListe)
    {
        $total = 0;
        foreach ($colisListe as $colis) {
            $total += $colis->getPoids() * $colis->getTarif();
        }
        $this->setMontantTotal($total);
    }
}

