import React from 'react';
import type { IMetricsResponse } from "../types/metrics";

export default function MetricsTable({ metrics }: { metrics: IMetricsResponse }) {
    return (
        <table border={1} cellPadding={10} style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Orders Count</td>
                <td>{metrics.ordersCount}</td>
            </tr>
            <tr>
                <td>Currency</td>
                <td>{metrics.currency}</td>
            </tr>
            <tr>
                <td>Gross Revenue</td>
                <td>{metrics.grossRevenue}</td>
            </tr>
            <tr>
                <td>Average Order Value</td>
                <td>{metrics.avgOrderValue}</td>
            </tr>
            <tr>
                <td>Refunded Amount</td>
                <td>{metrics.refundedAmount}</td>
            </tr>
            <tr>
                <td>Net Revenue</td>
                <td>{metrics.netRevenue}</td>
            </tr>
            </tbody>
        </table>
    );
}