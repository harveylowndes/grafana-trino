import React, { ChangeEvent, PureComponent } from 'react';
import { DataSourceHttpSettings, InlineField, InlineSwitch, Input } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { TrinoDataSourceOptions, TrinoDataSecureSourceOptions } from './types';
interface Props extends DataSourcePluginOptionsEditorProps<TrinoDataSourceOptions, TrinoDataSecureSourceOptions> {}
interface State {}
export class ConfigEditor extends PureComponent<Props, State> {
    render() {
        const { options, onOptionsChange } = this.props;
        const onEnableImpersonationChange = (event: ChangeEvent<HTMLInputElement>) => {
            onOptionsChange({ ...options, jsonData: { ...options.jsonData, enableImpersonation: event.target.checked } });
        };
        const onAccessTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
            onOptionsChange({ ...options, secureJsonData: { ...options.secureJsonData, accessToken: event.target.value } });
        };
        const onResetAccessToken = () => {
            onOptionsChange({ ...options, secureJsonFields: { ...options.secureJsonFields, accessToken: false } });
        };
        return (
            <div className="gf-form-group">
                <DataSourceHttpSettings
                    defaultUrl="http://localhost:8080"
                    dataSourceConfig={options}
                    onChange={onOptionsChange}
                />
                <h3 className="page-heading">Trino</h3>
                <div className="gf-form-group">
                    <div className="gf-form-inline">
                        <InlineField
                            label="Impersonate logged in user"
                            tooltip="If enabled, set the Trino session user to the current Grafana user"
                        >
                            <InlineSwitch
                                id="trino-settings-enable-impersonation"
                                value={options.jsonData?.enableImpersonation ?? false}
                                onChange={onEnableImpersonationChange}
                            />
                        </InlineField>
                    </div>
                    <div className="gf-form-inline">
                        <InlineField
                            label="Access Token"
                            tooltip="Enter your OAuth Access Token here. This field is protected."
                        >
                            {options.secureJsonFields?.accessToken ? (
                                <button
                                    className="btn btn-secondary"
                                    onClick={onResetAccessToken}
                                >
                                    Reset Access Token
                                </button>
                            ) : (
                                <Input
                                    type="password"
                                    value={options.secureJsonData?.accessToken || ''}
                                    placeholder="Enter access token"
                                    width={40}
                                    onChange={onAccessTokenChange}
                                />
                            )}
                        </InlineField>
                    </div>
                </div>
            </div>
        );
    }
}