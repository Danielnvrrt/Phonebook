const Filter = ({ filterValue, handleValueFiltered }) => {
    return (
      <div>
        filter shown with{' '}
        <input value={filterValue} onChange={handleValueFiltered} />
      </div>
    );
  };
  
  export default Filter;
  
