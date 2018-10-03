import React, { Children, Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Empty from './empty';
import { defaultToArray } from '@hamletink/util/projections';
import { always, converge, invoker, map, path, pipe } from 'ramda';

const getStylesProp = path(['props', 'styles']);
const invokeStyles = converge(pipe, [
  always(getStylesProp),
  always(defaultToArray),
  pipe(invoker(0), map)
]);

const use   = invokeStyles('use');
const unuse = invokeStyles('unuse');

export class StyleLoaderComponent extends ReactComponent {
  componentWillMount () {
    use(this);
  }

  componentWillUnmount () {
    unuse(this);
  }

  render () {
    const { props: { children, className } } = this;

    if (Children.count(children)) {
      const classes = classnames('hi-style-loader', className);
      return <div className={classes}>{children}</div>;
    }

    return <Empty />;
  }
}

export const STYLE_SHAPE =
  PropTypes.shape({
    use: PropTypes.func.isRequired,
    unuse: PropTypes.func.isRequired
  });

export const STYLES_SHAPE = PropTypes.oneOfType([
  STYLE_SHAPE,
  PropTypes.arrayOf(STYLE_SHAPE)
]);

StyleLoaderComponent.propTypes = {
  styles: STYLES_SHAPE
};

export default StyleLoaderComponent;

