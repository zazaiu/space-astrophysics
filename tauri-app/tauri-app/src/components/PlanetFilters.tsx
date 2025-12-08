import { useState } from 'react';
import type { FilterParams } from '../types/planets';

interface PlanetFiltersProps {
  onFilter: (filters: FilterParams) => void;
}

export const PlanetFilters: React.FC<PlanetFiltersProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<FilterParams>({});
  // const [showAdvanced, setShowAdvanced] = useState(false); // ЗАКОММЕНТИРОВАНО

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const emptyFilters: FilterParams = {};
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div style={{ padding: '20px 34px' }}>
      <form onSubmit={handleSubmit}>
        {/* Основной поиск */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            className="search-input"
            placeholder="Введите планету для поиска"
            value={filters.name || ''}
            onChange={(e) => setFilters({...filters, name: e.target.value})}
            style={{ flex: 1 }}
          />
          <button 
            type="submit" 
            className="select-button"
            style={{ width: 'auto', padding: '0 30px' }}
          >
            Найти
          </button>
        </div>

        {/* Расширенные фильтры - ЗАКОММЕНТИРОВАНО */}
        {/*
        <div style={{ 
          display: showAdvanced ? 'grid' : 'none',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '15px',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#ffffff0a',
          borderRadius: '12px'
        }}>
          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px' }}>
              Дата от
            </label>
            <input 
              type="date"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #311b77',
                backgroundColor: 'transparent',
                color: '#fff'
              }}
              value={filters.startDate || ''}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px' }}>
              Дата до
            </label>
            <input 
              type="date"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #311b77',
                backgroundColor: 'transparent',
                color: '#fff'
              }}
              value={filters.endDate || ''}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px' }}>
              Цена до
            </label>
            <input 
              type="number"
              placeholder="Макс. цена"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #311b77',
                backgroundColor: 'transparent',
                color: '#fff'
              }}
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
            />
          </div>
        </div>
        */}

        {/* Кнопки управления - ЗАКОММЕНТИРОВАНО, оставляем только сброс */}
        {/*
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            type="submit" 
            className="select-button"
            style={{ width: 'auto', padding: '0 30px' }}
          >
            Применить фильтры
          </button>
        */}
          
          <button 
            type="button"
            onClick={handleReset}
            style={{
              padding: '15px 30px',
              borderRadius: '12px',
              border: '2px solid #311b77',
              backgroundColor: 'transparent',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Сбросить
          </button>
          
          {/*
          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              padding: '15px 30px',
              borderRadius: '12px',
              border: '2px solid #8a2be2',
              backgroundColor: 'transparent',
              color: '#8a2be2',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {showAdvanced ? 'Скрыть фильтры' : 'Расширенные фильтры'}
          </button>
        </div>
        */}
      </form>
    </div>
  );
};