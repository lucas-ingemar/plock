package kitchen

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/gofrs/uuid/v5"
	"github.com/lucas-ingemar/plock/pkg/database"
	"github.com/lucas-ingemar/plock/pkg/types"
	"github.com/samber/lo"

	jstypes "github.com/atombender/go-jsonschema/pkg/types"
)

func (k *Kitchen) GetReceiptByHaulID(ctx context.Context, haulID uuid.UUID) (types.Receipt, error) {
	dbReceipt, err := k.db.GetReciptByHaulID(ctx, haulID)
	if err != nil {
		return types.Receipt{}, err
	}

	dbReceiptItems, err := k.db.ListReciptItemsByRecieptID(ctx, dbReceipt.ID)
	if err != nil {
		return types.Receipt{}, err
	}

	receiptItems := lo.Map(dbReceiptItems, func(item database.ReceiptItem, _ int) types.ReceiptItem {
		category := types.ItemCategoryOther

		if item.Category.Valid {
			category = types.ItemCategory(item.Category.String)
		}

		return types.ReceiptItem{
			Brand:    database.NilStr(item.Brand),
			Category: category,
			Discount: database.NilFloat64(item.Discount),
			IsFood:   item.IsFood,
			Name:     item.Name,
			Price:    item.Price,
			Quantity: item.Quantity,
			Unit:     types.Unit(item.Unit),
		}
	})

	if len(dbReceipt.Date) == 8 && strings.Count(dbReceipt.Date, "-") != 2 {
		dbReceipt.Date = fmt.Sprintf("%s-%s-%s", dbReceipt.Date[0:4], dbReceipt.Date[4:6], dbReceipt.Date[6:8])
	}

	parsed, err := time.Parse(time.DateOnly, dbReceipt.Date)
	if err != nil {
		return types.Receipt{}, fmt.Errorf("parse receipt date %q: %w", dbReceipt.Date, err)
	}

	date := jstypes.SerializableDate{Time: parsed}

	return types.Receipt{
		Currency:     dbReceipt.Currency,
		Date:         date,
		ItemCount:    int(dbReceipt.ItemCount),
		Items:        receiptItems,
		Store:        dbReceipt.Store,
		Summary:      dbReceipt.Summary,
		Total:        dbReceipt.Total,
		TotalSavings: database.NilFloat64(dbReceipt.TotalSavings),
	}, nil
}
