export default function KpiCards({ kpis }) {
  return (
    <div className="kpi-cards">
      {kpis.map(({ label, value, icon }) => (
        <div key={label} className="kpi-card">
          <div className="kpi-label">
            <i
              className={`bi ${icon}`}
              style={{ marginRight: "8px", color: "#8faaa3", fontSize: "1.4rem" }}
            ></i>
            {label}
          </div>
          <div className="kpi-value">{value}</div>
        </div>
      ))}
    </div>
  );
}