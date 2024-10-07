package trino

import (
	"context"
	"fmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/trinodb/grafana-trino/pkg/trino/models"
	"github.com/grafana/sqlds/v2"
)

type SQLDatasourceWithTrinoUserContext struct {
	sqlds.SQLDatasource
}

func (ds *SQLDatasourceWithTrinoUserContext) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	config := req.PluginContext.DataSourceInstanceSettings
	settings := models.TrinoDatasourceSettings{}
	err := settings.Load(*config)
	if err != nil {
		return nil, fmt.Errorf("error reading settings: %s", err.Error())
	}

	if settings.EnableImpersonation {
		user := req.PluginContext.User
		if user == nil {
			return nil, fmt.Errorf("user can't be nil if impersonation is enabled")
		}

		ctx = context.WithValue(ctx, "X-Trino-User", user)
	}

	return ds.SQLDatasource.QueryData(ctx, req)
}

func (ds *SQLDatasourceWithTrinoUserContext) NewDatasource(ctx context.Context, settings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	_, err := ds.SQLDatasource.NewDatasource(settings)
	if err != nil {
		return nil, err
	}
	return ds, nil
}

func NewDatasource(c sqlds.Driver) *SQLDatasourceWithTrinoUserContext {
	base := sqlds.NewDatasource(c)
	return &SQLDatasourceWithTrinoUserContext{*base}
}
