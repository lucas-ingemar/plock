package database

import (
	"github.com/lucas-ingemar/plock/pkg/types"
)

func (r Recipe) ToApiRecipe() types.Recipe {
	return types.Recipe{
		ID:               r.ID,
		Cuisine:          types.Cuisine(r.Cuisine),
		Description:      r.Description,
		Difficulty:       types.Difficulty(r.Difficulty),
		KidTips:          NilStr(r.KidTips),
		Protein:          types.Protein(r.Protein),
		Servings:         int(r.Servings),
		Title:            r.Title,
		TotalTimeMinutes: int(r.TotalTimeMinutes),
	}
}
