import * as Preact from 'preact';

export default (view, container, data) => {
    return Preact.render(view(container, data), container);
};
