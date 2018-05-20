import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { filter } from 'lodash';

class MapInset extends React.Component {
  constructor(props) {
    super(props);
    this.addClickListener = this.addClickListener.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.setStateStyle = this.setStateStyle.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
  }

  setStateStyle() {
    const { items, stateName } = this.props;
    const lowNumbers = ['in', 'ABR'];
    const medNumbers = ['in', 'ABR'];
    const highNumbers = ['in', 'ABR'];
    if (!items) {
      return;
    }
    let count = 0;
    count += filter((items), 'pledged').length;
    if (count >= 10) {
      highNumbers.push(stateName);
    } else if (count >= 4) {
      medNumbers.push(stateName);
    } else if (count > 0 && count < 4) {
      lowNumbers.push(stateName);
    }
    this.toggleFilters('high_number', highNumbers);
    this.toggleFilters('med_number', medNumbers);
    this.toggleFilters('low_number', lowNumbers);
  }

  handleReset() {
    this.removeHighlights();
    this.props.resetSelections();
  }

  addClickListener() {
    const {
      stateName,
      setUsState,
    } = this.props;
    const { map } = this;

    map.on('click', () => {
      setUsState({ usState: stateName });
    });
  }
  toggleFilters(layer, filterRules) {
    this.map.setFilter(layer, filterRules);
    this.map.setLayoutProperty(layer, 'visibility', 'visible');
  }

  initializeMap() {
    const {
      bounds,
      mapId,
    } = this.props;

    mapboxgl.accessToken =
        'pk.eyJ1IjoidG93bmhhbGxwcm9qZWN0IiwiYSI6ImNqMnRwOG4wOTAwMnMycG1yMGZudHFxbWsifQ.FXyPo3-AD46IuWjjsGPJ3Q';
    const styleUrl = 'mapbox://styles/townhallproject/cjgr7qoqr00012ro4hnwlvsyp';

    this.map = new mapboxgl.Map({
      container: mapId,
      doubleClickZoom: false,
      dragPan: false,
      scrollZoom: false,
      style: styleUrl,
    });

    // map on 'load'
    this.map.on('load', () => {
      this.map.fitBounds(bounds, {
        easeTo: { duration: 0 },
        linear: true,
      });
      this.addClickListener();
      this.setStateStyle();
    });
  }

  render() {
    const {
      selectedState,
      mapId,
    } = this.props;
    const mapClassNames = classNames({
      hidden: selectedState,
      inset: true,
    });
    return (
      <React.Fragment>
        <div id={mapId} className={mapClassNames} data-bounds={this.props.bounds} />
      </React.Fragment>
    );
  }
}

MapInset.propTypes = {
  bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  mapId: PropTypes.string.isRequired,
  resetSelections: PropTypes.func.isRequired,
  selectedState: PropTypes.string,
  setUsState: PropTypes.func.isRequired,
  stateName: PropTypes.string.isRequired,
};

MapInset.defaultProps = {
  items: [],
  selectedState: '',
};

export default MapInset;