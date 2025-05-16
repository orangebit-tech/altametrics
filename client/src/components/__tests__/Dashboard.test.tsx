import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';

jest.mock('../../components/Header', () => () => <div>Mock Header</div>);
jest.mock('../../components/Sidebar', () => () => <div>Mock Sidebar</div>);
jest.mock('../../components/Footer', () => () => <div>Mock Footer</div>);

describe('Dashboard Layout', () => {
  it('renders header, sidebar, footer, and outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<div>Mock Outlet Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Mock Header')).toBeInTheDocument();
    expect(screen.getByText('Mock Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Mock Footer')).toBeInTheDocument();
    expect(screen.getByText('Mock Outlet Content')).toBeInTheDocument();
  });
});
