import React from 'react';
import classes from './MyInput.module.css'

const MyInput = React.forwardRef((props, ref) => {
  return (
    <div>
      <input ref={ref} className={classes.myInput} {...props}/>
    </div>
  );
});

export default MyInput;
