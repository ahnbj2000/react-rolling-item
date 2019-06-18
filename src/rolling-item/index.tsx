import * as React from 'react';
import styles from './rolling-item.module.scss';
import styled, { css, keyframes } from 'styled-components';
import { detect } from 'detect-browser';
import classNames from 'classnames';

type IItemInfo = {x: string | number, y: string | number, id?: any};
interface IRollingItemProps {
  on: boolean;
  row: number;
  backgroundImage: string;
  backgroundSize: string;
  itemInfo: IItemInfo[];
  width: number;
  height: number;
  completionAnimation?: boolean;
  onProgress?: (progress: boolean, result?: any[]) => void;
}

interface IRollingItemState {
  on: boolean;
  animationState: boolean;
  eachAnimationState: boolean[];
  pos: number[];
  itemInfo: IItemInfo[][];
}

const RAF_DELAY = 1;

const RollingBox: any = styled.div<any>`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
`;

// const BoxDiv: any = styled.div<any>`
//   transform: ${props => `translate(0px, ${props.pos}px)`};
//   animation: ${props => css`${props.animation} 1s ease 1`};
// `;

// 연속적인 transform animation 속성의 경우 위와 같이 작성하면 픽셀 변경 시마다 새로운 className(styled-components에서 생성하는)이
// 매번 생성되어 perfomance 오류가 발생
// 이를 피하려면 attrs 메소드를 사용한다.
const BoxDiv: any = styled.div.attrs<any>((props) => ({
  style: {
    transform: `translate(0px, ${props.pos}px)`,
    msTransform: `translate(0px, ${props.pos}px)`,
  }
}))`
  ${(props: any) => css`animation: ${props.animation} 0.6s ease-out 1`};
`;

const RollingImages: any = styled.div<any>`
  background: url(${props => props.backgroundImage});
  background-size: ${props => props.backgroundSize};
  background-position: ${props => typeof props.pos.x === 'number' ? `${props.pos.x}px` : props.pos.x} ${props => typeof props.pos.y === 'number' ? `${props.pos.y}px` : props.pos.y};
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
`;

export default class RollingItem extends React.PureComponent<IRollingItemProps, IRollingItemState> {
  private rollingRafId: any[] = [];
  private loopRafId: any = null;
  private boxHeight: number = 0;
  private movePixel: number[] = [];
  private stopDelay: number[] = [];
  private resultId: any[] = [];

  static getDerivedStateFromProps(props: IRollingItemProps, state: IRollingItemState) {
    if (state.pos.length == 0) {
      return {
        pos: Array(props.row).fill(-(props.height * props.itemInfo.length)),
        itemInfo: Array(props.row).fill([...props.itemInfo]),
      }
    }

    if (props.on !== state.on) {
      return {
        on: props.on && !state.animationState,
      }
    }

    return null;
  }

  /* tslint:disable:no-console */
  constructor(props: IRollingItemProps, context?: any) {
    super(props, context);

    this.state = {
      on: false,
      animationState: false,
      eachAnimationState: [false, false, false],
      pos: [],
      itemInfo: [],
    }
  }

  public componentDidMount(): void {
    const { itemInfo } = this.state;
    const shufflePos: IItemInfo[][] = [];

    this.boxHeight = this.props.height * this.props.itemInfo.length;

    itemInfo.forEach((eachPos) => {
      shufflePos.push(this.shuffle(eachPos));
    });

    this.setState({
      itemInfo: shufflePos,
    });
  }

  public componentDidUpdate(prevProps: IRollingItemProps, prevState: IRollingItemState): void {
    if (prevState.on !== this.state.on) {
      if (this.state.on) {
        this.setState({ animationState: true });

        let execCount = 0;
        const callback = (next?: any) => {
          let now = new Date().getTime();
          if (typeof next === 'undefined' || now > next && execCount < this.props.row) {
            this.stopDelay[execCount] = execCount * 50;
            this.cancel(execCount);
            this.movePixel[execCount] = ((detect() as any).name === 'ie' ? 20 : 10) * this.props.height * 0.01;
            this.animate(execCount);
            next = now;
          }
          execCount++;

          if (execCount === 3) {
            cancelAnimationFrame(this.loopRafId);
          } else {
            this.loopRafId = requestAnimationFrame(callback.bind(this, next));
          }
        }

        this.loopRafId = requestAnimationFrame(callback);

        if (this.props.onProgress) {
          this.props.onProgress(true);
        }
      }
    }
  }

  public render(): React.ReactNode {
    const { backgroundImage, backgroundSize, width, height, completionAnimation = false } = this.props;
    const { itemInfo, eachAnimationState } = this.state;
    const rollingBoxes: any[] = [];

    itemInfo.forEach((eachPos, i) => {
      let frame = eachAnimationState[i] && completionAnimation ? keyframes`
        50% { transform: translate(0, ${this.state.pos[i]+30 }px); }
        100% { transform: translate(0, ${this.state.pos[i] }px); }
      ` : null;

      rollingBoxes.push(
        <RollingBox className={classNames(styles.box, 'roll_box_item')} {...{ width, height }} key={i}>
          <BoxDiv
            { ...{ pos: this.state.pos[i], animation: frame } }
            key={`inner_${i}`}
          >
            {
              eachPos.map(
                (pos, i) => <RollingImages {...{ pos, backgroundImage, backgroundSize, width, height }} key={i} />
              )
            }
            <RollingImages {...{ pos: eachPos[0], backgroundImage, backgroundSize, width, height }} key={i} />
          </BoxDiv>
        </RollingBox>
      );
    });

    return (
      <div className={classNames(styles.rolling, 'roll_box_wrap')}>
        <div className={classNames(styles.inner, 'roll_box_inner')}>
          {rollingBoxes}
        </div>
      </div>
    );
  }

  private shuffle = (pos: IItemInfo[]): IItemInfo[] => {
    const shufflePos = [...pos];

    shufflePos.forEach((v, i) => {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shufflePos[i], shufflePos[randomIndex]] = [shufflePos[randomIndex], shufflePos[i]];
    });

    return shufflePos;
  }

  private animate = (index: number = 0): void => {
    let pos = this.state.pos[index];

    const callback = (next?: any) => {
      let now = new Date().getTime();

      if (!this.state.on) {
        if (this.stopDelay[index] === 0) {
          if (this.movePixel[index] > 5) {
            this.movePixel[index] = this.movePixel[index]-=1;
          } else {
            if (this.state.pos[index] % this.props.height !== 0) {
              this.movePixel[index] = 5;
            } else {
              if (index !== 0 && this.movePixel[index - 1] !== 0) {
                this.movePixel[index] = 5;
              } else {
                this.movePixel[index] = 0;
              }
            }
          }
        }

        if (this.stopDelay[index] > 0) {
          this.stopDelay[index]--;
        }
      }

      if (typeof next === 'undefined' || now > next) {
        this.setState({
          pos: this.state.pos.map((v, i) => {
            if (i === index) {
              return Math.floor(pos+=this.movePixel[index]);
            } else {
              return v;
            }
          }),
        });
        next = now + RAF_DELAY;
      }

      if (Math.floor(this.state.pos[index]) >= 0) {
        this.setState({
          pos: this.state.pos.map((v, i) => {
            if (i === index) {
              return -this.boxHeight;
            } else {
              return v;
            }
          }),
        });
        next = undefined;
        pos = -this.boxHeight;
      }

      if (this.movePixel[index] === 0) {
        const itemInfo = this.state.itemInfo[index];
        itemInfo.some((v, i) => {
          if ((i + 1) === Math.abs(this.state.pos[index]) / this.props.height) {
            let selectedItem = itemInfo[i + 1];
            if (!selectedItem) {
              selectedItem = itemInfo[0];
            }
            this.resultId[index] = selectedItem.id || i;
            return true;
          }
          return false;
        });

        this.setState({
          eachAnimationState: this.state.eachAnimationState.map((v, i) => {
            return index === i || !!v;
          })
        });

        this.cancel(index);
        if (this.props.onProgress && this.rollingRafId.every((v) => v === null)) {
          this.props.onProgress(false, this.resultId);
          this.setState({ animationState: false });
          this.resultId = [];
        }
      } else {
        this.rollingRafId[index] = requestAnimationFrame(callback.bind(this, next));
      }
    };

    if (this.state.on) {
      this.rollingRafId[index] = requestAnimationFrame(callback);
    }
  }

  private cancel = (index: number): void => {
    cancelAnimationFrame(this.rollingRafId[index]);
    this.rollingRafId.splice(index, 1, null);
  }
}

