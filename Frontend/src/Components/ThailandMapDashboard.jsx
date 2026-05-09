import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import axios from 'axios';

import thailandGeoJson from '../assets/thailand-provinces.json';
echarts.registerMap('Thailand', thailandGeoJson);

const ThailandMapDashboard = ({ compact = false, activeCategory = 'hearers', selectedYear = 2026 }) => {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/province-stats?year=${selectedYear}&category=${activeCategory}`)
      .then(res => {
        const data = res.data.map(p => ({ name: p.nameEn, value: p.helpCount }));
        setMapData(data);
      })
      .catch(error => {
        // Log API error
        console.error('Failed to fetch province stats:', error);
        setMapData([]);
      })
      .finally(() => setLoading(false));
  }, [selectedYear, activeCategory]);

  const options = {
    backgroundColor: 'transparent',

    tooltip: {
      trigger: 'item',
      backgroundColor: '#1b2537',
      borderColor: '#334155',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#e2e8f0',
        fontFamily: 'Kanit, sans-serif',
        fontSize: 13,
      },
      formatter: params => {
        if (params.value !== undefined && params.value !== '-' && params.value > 0) {
          return `
            <div style="line-height:1.7">
              <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:3px">${params.name}</div>
              <div style="color:#fbbf24">ผู้รับการช่วยเหลือ: <b>${Number(params.value).toLocaleString()}</b> คน</div>
            </div>`;
        }
        return `<div style="color:#fff;font-weight:700;font-size:13px">${params.name}</div><div style="color:#64748b;font-size:11px;margin-top:2px">ยังไม่มีข้อมูล</div>`;
      },
    },

    visualMap: {
      type: 'piecewise',
      left: 'left',
      top: 'middle',
      orient: 'vertical',
      showLabel: true,
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 10,
      textStyle: {
        color: '#94a3b8',
        fontFamily: 'Kanit, sans-serif',
        fontSize: 11,
        lineHeight: 18,
      },
      pieces: [
        { min: 10001,             label: '> 10,000  (เยอะมาก)', color: '#ff4d4f' },
        { min: 5001, max: 10000,  label: '5,001 - 10,000',      color: '#ffa940' },
        { min: 1001, max: 5000,   label: '1,001 - 5,000',       color: '#ffec3d' },
        { min: 1,    max: 1000,   label: '1 - 1,000',           color: '#73d13d' },
        { value: 0,               label: 'ไม่มีข้อมูล',          color: '#334155' },
      ],
    },

    series: [
      {
        name: 'สถิติพันธกิจ',
        type: 'map',
        map: 'Thailand',
        roam: true,
        zoom: 1.2,
        aspectScale: 0.9,
        layoutCenter: ['52%', '50%'],
        layoutSize: '95%',
        scaleLimit: { min: 0.8, max: 8 },
        label: { show: false },
        itemStyle: {
          areaColor: '#1e293b',
          borderColor: 'rgba(148,163,184,0.15)',
          borderWidth: 0.8,
        },
        emphasis: {
          label: {
            show: true,
            position: 'outside',
            distance: 20,
            color: '#ffffff',
            fontFamily: 'Kanit, sans-serif',
            fontSize: 12,
            fontWeight: 'bold',
            formatter: params =>
              params.value > 0
                ? `{b|${params.name}}\n{c|${Number(params.value).toLocaleString()} คน}`
                : `{b|${params.name}}\n{d|ไม่มีข้อมูล}`,
            rich: {
              b: {
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: 12,
                fontFamily: 'Kanit, sans-serif',
                padding: [5, 10, 2, 10],
              },
              c: {
                color: '#00f2fe',
                fontSize: 11,
                fontFamily: 'Kanit, sans-serif',
                padding: [2, 10, 5, 10],
              },
              d: {
                color: '#64748b',
                fontSize: 11,
                fontFamily: 'Kanit, sans-serif',
                padding: [2, 10, 5, 10],
              },
            },
            backgroundColor: '#1b2537',
            borderColor: 'rgba(0, 242, 254, 0.3)',
            borderWidth: 1,
            borderRadius: 6,
            padding: 0,
            shadowBlur: 8,
            shadowColor: 'rgba(0, 242, 254, 0.2)',
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 10,
            lineStyle: {
              color: 'rgba(0, 242, 254, 0.8)',
              type: 'solid',
              width: 1.5,
            },
          },
          itemStyle: {
            areaColor: '#0e7db5',
            shadowBlur: 30,
            shadowColor: 'rgba(0, 242, 254, 0.65)',
            borderColor: '#00f2fe',
            borderWidth: 1.5,
          },
        },
        select: {
          itemStyle: { areaColor: '#0054a5' },
        },
        data: mapData,
      },
    ],
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center p-4 md:p-6" style={{ height: compact ? '460px' : '620px' }}>
      {loading ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-500">
          <svg className="animate-spin w-10 h-10 text-[#00a3ff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm font-light">กำลังโหลดข้อมูลแผนที่...</p>
        </div>
      ) : (
        <>
          <ReactECharts
            option={options}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
            notMerge
            lazyUpdate
          />
          {!compact && (
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#ff4d4f]" /> มีข้อมูลมาก (&gt;10,000)</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#ffa940]" /> 5,001–10,000</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#ffec3d]" /> 1,001–5,000</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#73d13d]" /> 1–1,000</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#334155]" /> ไม่มีข้อมูล</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ThailandMapDashboard;