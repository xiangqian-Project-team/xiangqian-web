"use client";

import React from "react";
import { ConfigProvider } from "antd";

const withTheme = (node) => (
    <>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#86F1D3',
                },
                components: {
                    Button: {
                        defaultBg: '#F5F5F5'
                    },
                    Input: {
                        paddingBlock: 6
                    }
                },
            }}
        >
            <ConfigProvider
                theme={{
                    token: {
                        borderRadius: 4,
                    },
                }}
            >
                {node}
            </ConfigProvider>
        </ConfigProvider>
    </>
)

export default withTheme;
