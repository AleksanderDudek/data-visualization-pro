import React, { useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@apollo/client";
import { GET_COUNTRIES } from "../../graphql/queries";
import { useAppDispatch, useAppSelector } from "../../store";
import { setSearchQuery, setRegionFilter } from "../../store/slices/filtersSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { useNumberFormatter } from "../../hooks/useNumberFormatter";
import type { Country } from "../../types";
import type { ColDef, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface QueryData {
  countries: Country[];
}

// Custom cell renderer for flag + name
const FlagNameRenderer: React.FC<ICellRendererParams<Country>> = ({ data }) => {
  if (!data) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 20 }}>{data.flagEmoji}</span>
      <div>
        <div style={{ fontWeight: 600 }}>{data.name}</div>
        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{data.code}</div>
      </div>
    </div>
  );
};

// Custom cell renderer for languages
const LanguagesRenderer: React.FC<ICellRendererParams<Country>> = ({ value }) => {
  if (!value || !Array.isArray(value)) return null;
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {(value as string[]).slice(0, 3).map((lang) => (
        <span
          key={lang}
          style={{
            fontSize: 10,
            padding: "1px 6px",
            borderRadius: 4,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          {lang}
        </span>
      ))}
      {value.length > 3 && (
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
          +{value.length - 3}
        </span>
      )}
    </div>
  );
};

// Sparkline-style population bar
const PopulationBarRenderer: React.FC<ICellRendererParams<Country>> = ({ value }) => {
  const maxPop = 1_500_000_000; // China/India range
  const pct = Math.min(((value as number) / maxPop) * 100, 100);
  const fmt = useNumberFormatter();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: "var(--bg-primary)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: pct > 50 ? "var(--accent-red)" : pct > 10 ? "var(--accent-orange)" : "var(--accent-cyan)",
            borderRadius: 3,
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, minWidth: 50, textAlign: "right" }}>
        {fmt(value as number)}
      </span>
    </div>
  );
};

const REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania", "Antarctic"];

export const CountryGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((s) => s.filters.searchQuery);
  const regionFilter = useAppSelector((s) => s.filters.regionFilter);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, loading, error } = useQuery<QueryData>(GET_COUNTRIES, {
    variables: {
      region: regionFilter,
      search: debouncedSearch || undefined,
    },
  });

  const columnDefs = useMemo<ColDef<Country>[]>(
    () => [
      {
        headerName: "Country",
        field: "name",
        cellRenderer: FlagNameRenderer,
        minWidth: 200,
        flex: 2,
        filter: "agTextColumnFilter",
        sortable: true,
      },
      {
        headerName: "Capital",
        field: "capital",
        minWidth: 120,
        flex: 1,
        filter: "agTextColumnFilter",
        sortable: true,
      },
      {
        headerName: "Region",
        field: "region",
        minWidth: 100,
        flex: 1,
        filter: "agSetColumnFilter",
        sortable: true,
        cellStyle: { color: "var(--accent-purple)" },
      },
      {
        headerName: "Population",
        field: "population",
        cellRenderer: PopulationBarRenderer,
        minWidth: 200,
        flex: 2,
        filter: "agNumberColumnFilter",
        sortable: true,
        sort: "desc",
      },
      {
        headerName: "Area (km²)",
        field: "area",
        minWidth: 120,
        flex: 1,
        filter: "agNumberColumnFilter",
        sortable: true,
        valueFormatter: (params: ValueFormatterParams) =>
          params.value != null ? Number(params.value).toLocaleString() : "—",
      },
      {
        headerName: "Languages",
        field: "languages",
        cellRenderer: LanguagesRenderer,
        minWidth: 180,
        flex: 2,
        filter: false,
        sortable: false,
      },
      {
        headerName: "Lat",
        field: "lat",
        minWidth: 80,
        maxWidth: 90,
        filter: "agNumberColumnFilter",
        valueFormatter: (params: ValueFormatterParams) =>
          params.value != null ? (params.value as number).toFixed(1) : "—",
      },
      {
        headerName: "Lng",
        field: "lng",
        minWidth: 80,
        maxWidth: 90,
        filter: "agNumberColumnFilter",
        valueFormatter: (params: ValueFormatterParams) =>
          params.value != null ? (params.value as number).toFixed(1) : "—",
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      suppressMovable: false,
    }),
    []
  );

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchQuery(e.target.value));
    },
    [dispatch]
  );

  const onRegionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setRegionFilter(e.target.value || null));
    },
    [dispatch]
  );

  if (error) {
    return (
      <div className="error-container">
        <div style={{ fontSize: 48 }}>💥</div>
        <div>{error.message}</div>
      </div>
    );
  }

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="filters-bar">
          <input
            type="text"
            className="filter-input"
            placeholder="🔍 Search civilizations..."
            value={searchQuery}
            onChange={onSearchChange}
          />
          <select
            className="filter-select"
            value={regionFilter ?? ""}
            onChange={onRegionChange}
          >
            <option value="">All Regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {loading
              ? "Scanning..."
              : `${data?.countries.length ?? 0} civilizations found`}
          </span>
        </div>
      </div>

      <div
        className="ag-theme-alpine-dark"
        style={{ height: "calc(100vh - 250px)", width: "100%" }}
      >
        <AgGridReact<Country>
          rowData={data?.countries ?? []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          pagination={true}
          paginationPageSize={50}
          rowHeight={48}
          headerHeight={40}
          getRowId={(params) => params.data.code}
          enableCellTextSelection={true}
        />
      </div>
    </>
  );
};
