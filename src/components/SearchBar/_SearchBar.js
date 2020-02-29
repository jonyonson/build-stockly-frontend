import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { makeSearchSelection } from '../../actions';
import './SearchBar.scss';

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => {
  // console.log('suggestion', suggestion);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>{suggestion['2. name']}</div>
      <div>{suggestion['1. symbol']}</div>
    </div>
  );
};

function SearchBar({ makeSearchSelection }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [matches, setMatches] = useState([]);
  // const [selection, setSelection] = useState({ symbol: '', name: '' });

  useEffect(() => {
    if (matches.length > 0) {
      const matchesToDisplay = matches.filter(
        match => !match['1. symbol'].includes('.')
      );

      setSuggestions(matchesToDisplay);
    }
  }, [matches]);

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = selection => {
    const suggestion = {
      symbol: selection['1. symbol'],
      name: selection['2. name']
    };
    makeSearchSelection(suggestion);
    return `${suggestion.symbol}, ${suggestion.name}`;
  };

  const onChange = (_, { newValue }) => setValue(newValue);

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => fetchBestMatches(value);

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => setSuggestions([]);

  const fetchBestMatches = input => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${input}&apikey=${API_KEY}`;

    axios
      .get(url)
      .then(res => setMatches(res.data.bestMatches))
      .catch(err => console.error(err));
  };

  const inputProps = {
    placeholder: 'Search by symbol or name',
    type: 'search',
    value,
    onChange
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  );
}

export default connect(
  null,
  { makeSearchSelection }
)(SearchBar);
