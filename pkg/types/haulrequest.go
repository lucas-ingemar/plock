// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    haulRequest, err := UnmarshalHaulRequest(bytes)
//    bytes, err = haulRequest.Marshal()

package types

import "encoding/json"

func UnmarshalHaulRequest(data []byte) (HaulRequest, error) {
	var r HaulRequest
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *HaulRequest) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

// Household and meal preferences used to generate recipes.
type HaulRequest struct {
	// Preferred cuisines. An empty list means any cuisine.                                                  
	CuisinePreferences                                                            []CuisinePreferenceElement `json:"cuisine_preferences"`
	Household                                                                     Household                  `json:"household"`
	// Maximum cooking time per meal.                                                                        
	MaxCookingMinutes                                                             int64                      `json:"max_cooking_minutes"`
	// Number of meals to plan.                                                                              
	MealCount                                                                     int64                      `json:"meal_count"`
	// Proteins the household eats. Proteins not listed are excluded from recipes.                           
	ProteinPreferences                                                            []ProteinPreferenceElement `json:"protein_preferences"`
	// Servings per meal, including any extra portions for leftovers.                                        
	ServingsPerMeal                                                               int64                      `json:"servings_per_meal"`
}

type Household struct {
	Adults   int64   `json:"adults"`
	Children []Child `json:"children"`
}

type Child struct {
	AgeYears int64 `json:"age_years"`
}

type CuisinePreferenceElement string

const (
	American      CuisinePreferenceElement = "american"
	Chinese       CuisinePreferenceElement = "chinese"
	French        CuisinePreferenceElement = "french"
	Greek         CuisinePreferenceElement = "greek"
	Indian        CuisinePreferenceElement = "indian"
	Italian       CuisinePreferenceElement = "italian"
	Japanese      CuisinePreferenceElement = "japanese"
	Korean        CuisinePreferenceElement = "korean"
	LatinAmerican CuisinePreferenceElement = "latin_american"
	Mexican       CuisinePreferenceElement = "mexican"
	Moroccan      CuisinePreferenceElement = "moroccan"
	Spanish       CuisinePreferenceElement = "spanish"
	Swedish       CuisinePreferenceElement = "swedish"
	Thai          CuisinePreferenceElement = "thai"
	Turkish       CuisinePreferenceElement = "turkish"
	Vietnamese    CuisinePreferenceElement = "vietnamese"
)

type ProteinPreferenceElement string

const (
	Beef       ProteinPreferenceElement = "beef"
	Chicken    ProteinPreferenceElement = "chicken"
	Fish       ProteinPreferenceElement = "fish"
	Lamb       ProteinPreferenceElement = "lamb"
	Pork       ProteinPreferenceElement = "pork"
	Seafood    ProteinPreferenceElement = "seafood"
	Vegan      ProteinPreferenceElement = "vegan"
	Vegetarian ProteinPreferenceElement = "vegetarian"
)
