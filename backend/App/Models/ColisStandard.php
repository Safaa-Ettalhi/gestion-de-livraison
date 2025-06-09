<?php
namespace App\Models;

class ColisStandard extends Colis
{
    private $delaiLivraison;
    private $assuranceIncluse;
    protected $expediteur;

    public function __construct($id, $poids, $dimensions, $destination, $tarif, $statut, $delaiLivraison, $assuranceIncluse, $expediteur)
    {
        parent::__construct($id, $poids, $dimensions, $destination, $tarif, $statut, $expediteur );
        $this->delaiLivraison = $delaiLivraison;
        $this->assuranceIncluse = $assuranceIncluse;
    }

    public function getType()
    {
        return 'standard';
    }

    public function getDelaiLivraison()
    {
        return $this->delaiLivraison;
    }

    public function setDelaiLivraison($delaiLivraison)
    {
        $this->delaiLivraison = $delaiLivraison;
    }

    public function isAssuranceIncluse()
    {
        return $this->assuranceIncluse;
    }

    public function setAssuranceIncluse($assuranceIncluse)
    {
        $this->assuranceIncluse = $assuranceIncluse;
    }

    public function jsonSerialize(): array
    {
        return array_merge(parent::jsonSerialize(), [
            'delaiLivraison' => $this->delaiLivraison,
            'assuranceIncluse' => $this->assuranceIncluse,
        ]);
    }
}
