import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./BreadCrumbs.css"
function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav>
      <ul className="breadcrumb">
        <li>
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((value, index) => {
          if (Number(value) || value.match(/^\d+$/)) {
            return null; // Skip the breadcrumb if it's an ID
          }
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return (
            <li key={to}>
              <Link to={to}>{value.charAt(0).toUpperCase() + value.slice(1)}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Breadcrumbs;
