import PropTypes from 'prop-types';

const FrameBody = ({
    children
}) => {
    return (
        <div>
            I am frame
            {children}
        </div>
               )
}
FrameBody.prototypes = {
  children: PropTypes.element.isRequired,
}

export default FrameBody;