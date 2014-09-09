var React = window.React;

var Day = React.createClass({
  selected: function() {
    this.props.onSelect(this.props.date, this.props.selected);
  },

  render: function() {
    var classes = React.addons.classSet({
      'kalenteri-day': true,
      'kalenteri-day-selected': this.props.selected,
      'kalenteri-day-next-month': this.props.nextMonth,
      'kalenteri-day-prev-month': this.props.previousMonth
    });

    var text = this.props.date.date();

    return React.DOM.div({className: classes, onClick: this.selected}, text);
  }
});

var Controls = React.createClass({
  render: function() {
    return (
      React.DOM.div({className: 'kalenteri-controls'},
        React.DOM.a({onClick: this.props.onPrevious}, '‹'),
        React.DOM.span(null, this.props.date.format('MMMM YYYY')),
        React.DOM.a({onClick: this.props.onNext}, '›')
      )
    );
  }
});

var Header = React.createClass({
  render: function() {
    var months = moment.monthsShort().map(function(month, i) {
      var classes = React.addons.classSet({
        'kalenteri-head-month': true,
        'kalenteri-head-active': this.props.date.month() === i
      });

      return React.DOM.div({className: classes, onClick: this.props.onMonthClick.bind(this, i)}, month);
    }, this);

    var days = Array.apply(null, {length: 7}).map(function(n, i) {
      return React.DOM.div({className: 'kalenteri-head-day'}, moment().weekday(i).format('ddd'));
    });

    return (
      React.DOM.div({className: 'kalenteri-header'},
        React.DOM.div({className: 'kalenteri-header'}, months),
        React.DOM.div({className: 'kalenteri-header'}, days)
      )
    );
  }
});

window.Kalenteri = React.createClass({
  getDefaultProps: function() {
    return {
      defaultDate: moment(),
      multiple: true,
      onSelect: function() {}
    };
  },

  getInitialState: function() {
    return {
      date: this.props.defaultDate,
      selected: []
    };
  },

  nextMonth: function() {
    this.setState({date: moment(this.state.date).add(1, 'month')});
  },

  previousMonth: function() {
    this.setState({date: moment(this.state.date).subtract(1, 'month')});
  },

  updateDate: function(date, active) {
    var selected = [];

    if(this.props.multiple) selected = this.state.selected;

    selected = selected.concat([date]);

    if(active) {
      selected = this.state.selected.filter(function(select) {
	return !date.isSame(select);
      });
    }

    this.props.onSelect(date, active, selected);

    this.setState({selected: selected});
  },

  updateMonth: function(month) {
    this.setState({date: moment(this.state.date).month(month)});
  },

  render: function() {
    var startDay = moment(this.state.date).date(0).weekday(0);

    var days = Array.apply(null, {length: 42}).map(function(n, i) {
      var date = moment(startDay).add(i, 'day').startOf('day');

      var selected = this.state.selected.some(function(selected) {
	return date.isSame(selected);
      });

      return Day({
	date: date,
	selected: selected,
	nextMonth: date.isAfter(this.state.date, 'month'),
	previousMonth: date.isBefore(this.state.date, 'month'),
	onSelect: this.updateDate
      });
    }, this);

    var controls = Controls({
      date: this.state.date,
      onNext: this.nextMonth,
      onPrevious: this.previousMonth
    });

    return (
      React.DOM.div({className: 'kalenteri'},
        controls,
        Header({date: this.state.date, onMonthClick: this.updateMonth}),
        React.DOM.div(null, days)
      )
    );
  }
});
