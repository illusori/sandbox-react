/** @jsx React.DOM */

"use strict";

var CenterContent = React.createClass({
    render: function () {
        return <div className="center-outside"><div className="center-inside">{this.props.children}</div></div>;
    }
});

var RadialButton = React.createClass({
    getInitialState: function () {
        return {
            selected:       false,
            parentSelected: false,
            siblingIndex:   false,
            siblingCount:   false
            };
    },

    componentDidMount: function () {
        if (this.props.children === undefined || !this.props.children.length) {
            return;
        }
        var children = (this.props.children || []).map(function (child, i) {
            child.setState({
                siblingIndex: i,
                siblingCount: this.props.children.length
                });
            return child;
        }.bind(this));
    },

    handleClick: function () {
        var selected = !this.state.selected;
        this.setState({ selected: selected });
        if (this.props.children !== undefined) {
            this.props.children.map(function (child, i) {
                child.setState({
                    parentSelected: selected
                    });
            }.bind(this))
        }
        return false;
    },

    render: function () {
//console.log("render", this.props.text, this);
        var cx = React.addons.classSet,
            classes = cx({
                'selected': this.state.selected,
                'child':    (this.state.siblingCount !== false)
                });
        if (classes.length) {
            classes = ' ' + classes;
        }
        var style = {};
        if (!this.state.selected && this.state.siblingIndex !== false) {
            var rotation = this.state.parentSelected ?
                (this.state.siblingIndex * (180 / (this.state.siblingCount - 1))) : 0;
            style.transform = 'rotateZ(-' + rotation + 'deg) ' +
                'translateX(120px) ' +
                'rotateZ(' + rotation + 'deg)';
            style['-webkit-transform'] = style.transform;
        }
        var children = '';
        if (this.props.children) {
            children = <div className={'radial-button-children' + classes}><CenterContent>{this.props.children}</CenterContent></div>;
        }
        return <div className={'radial-button-container' + classes}>
              {children}
              <div className={'radial-button' + classes} style={style} onClick={this.handleClick}><CenterContent>{this.props.text}</CenterContent></div>
            </div>;
    }
});

$('#example').css('height', $(window).innerHeight());

React.renderComponent(
    <CenterContent><RadialButton text="Begin">
      <RadialButton text="First"></RadialButton>
      <RadialButton text="Second"></RadialButton>
      <RadialButton text="Third"></RadialButton>
    </RadialButton></CenterContent>,
    $('#example').get(0)
    );

