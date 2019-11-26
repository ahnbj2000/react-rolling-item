import * as React from 'react';
import RollingItem from '../lib';

import imageFile from '../images/bg-fruit.png';

interface IContainerProps {

}

interface IContainerState {
  start: boolean;
  reset: boolean;
}
export default class Container extends React.PureComponent<IContainerProps, IContainerState> {

  constructor(props: IContainerProps, context?: any) {
    super(props, context);

    this.state = {
      start: false,
      reset: false,
    };
    this.onClick = this.onClick.bind(this);
    this.onClickReset = this.onClickReset.bind(this);
  }

  public render(): React.ReactNode {

    return (
      <>
        <RollingItem
          on={this.state.start}
          column={3}
          backgroundImage={imageFile}
          backgroundSize="600px 564px"
          introItemInfo={{ x: -39, y: -28 }}
          itemInfo={
            [
              { x: -39, y: -217, id: 0, probability: 100 },
              { x: -39, y: -406, id: 1, probability: 0 },
              { x: -241, y: -28, id: 2, probability: 0 },
              { x: -241, y: -217, id: 3, probability: 0 },
              { x: -241, y: -406, id: 4, probability: 0 },
              { x: -437, y: -28, id: 5, probability: 0 },
              { x: -437, y: -217, id: 6, probability: 0 },
              { x: -437, y: -406, id: 7, probability: 0 },
            ]
          }
          width={177}
          height={181}
          startDelay={1000}
          fixedIds={[3, 4, 7]}
          reset={this.state.reset}
          completionAnimation={true}
          onProgress={(isProgress, result) => { console.log(result); }}
        />
        <button className="start_btn" onClick={this.onClick}>{!this.state.start ? 'START' : 'STOP'}</button>
        <button className="reset_btn" onClick={this.onClickReset}>RESET</button>
      </>
    );
  }

  public onClick = (e: any) => {
    this.setState({ start: !this.state.start }, () => {
      setTimeout(() => {
        this.setState({ start: !this.state.start });
      }, 1500);
    });
  }

  public onClickReset = (e: any) => {
    this.setState({ reset: true }, () => {
      this.setState({ reset: false });
    });
  }
}