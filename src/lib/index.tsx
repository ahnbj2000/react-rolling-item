import * as React from 'react';
import styles from '../styles/rolling-item.module.scss';
import styled, { css, keyframes } from 'styled-components';
import { detect } from 'detect-browser';
import classNames from 'classnames';

type ItemInfo = {x: string | number, y: string | number, id?: any, intro?: boolean};
interface IRollingItemProps {
  on: boolean;
  row: number;
  backgroundImage: string;
  backgroundSize: string;
  itemInfo: ItemInfo[];
  width: number;
  height: number;
  startDelay?: number;
  reset?: boolean;
  completionAnimation?: boolean;
  onProgress?: (progress: boolean, result?: any[]) => void;
}

interface IRollingItemState {
  on: boolean;
  animationState: boolean;
  eachAnimationState: boolean[];
  pos: number[];
  itemInfo: ItemInfo[][];
  introItemInfo: ItemInfo;
  reset: boolean;
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
// 하지만 transform은 한번 이상 애니메이션을 실행시키면 다시 200 classes 오류가 발생하는 이슈로
// componentDidUpdate cycle에서 이전 애니메이션이 완료되면 state를 업데이트하여 해당 버그를 회피하도록 함.
const BoxDiv: any = styled.div.attrs<any>((props) => ({
  style: {
    transform: `translate3d(0, ${props.pos}px, 0)`,
    msTransform: `translate3d(0, ${props.pos}px, 0)`,
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
    if (state.pos.length === 0) {
      return {
        pos: [...new Array(props.row)].map(() => (-(props.height * props.itemInfo.length))),
        itemInfo: [...new Array(props.row)].map(() => ([...props.itemInfo])),
      }
    }

    if (props.on !== state.on) {
      return {
        on: props.on && !state.animationState,
      }
    }

    if (props.reset !== state.reset) {
      return {
        reset: props.reset,
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
      eachAnimationState: [...new Array(props.row)].map(() => (false)),
      pos: [],
      itemInfo: [],
      introItemInfo: {} as ItemInfo,
      reset: false,
    }
  }

  public componentDidMount(): void {
    const introItem = this.props.itemInfo.filter((v: ItemInfo) => { return v.intro; })[0];

    this.boxHeight = this.props.height * this.state.itemInfo[0].length;

    this.reset();
    this.setState({ introItemInfo: introItem });
  }

  public componentDidUpdate(prevProps: IRollingItemProps, prevState: IRollingItemState): void {
    const { on, reset } = this.state;

    if (prevState.on !== on && on) {
      this.setState({
        animationState: true,
        pos: [...new Array(this.props.row)].map(() => (-this.boxHeight)),
        eachAnimationState: [...new Array(this.props.row)].map(() => (false))
      });

      let execCount = 0;
      const callback = (next?: any) => {
        let now = new Date().getTime();
        if (typeof next === 'undefined' || (now > next && execCount < this.props.row)) {
          this.stopDelay[execCount] = execCount === 0 ? 0 : 3;
          this.cancel(execCount);
          this.movePixel[execCount] = Math.floor(((detect() as any).name === 'ie' ? 40 : 15) * this.props.height * 0.01);
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

      setTimeout(() => {
        this.loopRafId = requestAnimationFrame(callback);
      }, this.props.startDelay || 0);

      if (this.props.onProgress) {
        this.props.onProgress(true);
      }
    }

    if (prevState.reset !== reset && reset) {
      this.reset();
    }
  }

  public render(): React.ReactNode {
    const { backgroundImage, backgroundSize, width, height, completionAnimation = false } = this.props;
    const { itemInfo, introItemInfo, eachAnimationState } = this.state;
    const rollingBoxes: any[] = [];

    itemInfo.forEach((eachPos, i) => {
      let frame = eachAnimationState[i] && completionAnimation ? keyframes`
        50% { transform: translate3d(0, ${this.state.pos[i]+20 }px, 0); }
        100% { transform: translate3d(0, ${this.state.pos[i] }px, 0); }
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
          { introItemInfo && <RollingImages {...{ pos: introItemInfo, backgroundImage, backgroundSize, width, height }} key={'intro'} /> }
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

  private shuffle = (pos: ItemInfo[]): ItemInfo[] => {
    const posExceptIntro = pos.filter((v: ItemInfo) => {
      return !v.intro;
    });
    const shufflePos = [...posExceptIntro];

    shufflePos.forEach((v, i) => {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shufflePos[i], shufflePos[randomIndex]] = [shufflePos[randomIndex], shufflePos[i]];
    });

    return shufflePos;
  }

  private animate = (index: number = 0): void => {
    let pos = this.state.pos[index];
    let adjustedPos = 0;
    let firstLap = false;

    const callback = (next?: any) => {
      let now = new Date().getTime();

      if (!this.state.on) {
        if (this.state.pos[index] % this.props.height === 0 && this.stopDelay[index] === 0) {
          this.movePixel[index] = 0;
        } else {
          if (this.movePixel[index] > 5) {
            this.movePixel[index]--;
          }
        }

        if (this.stopDelay[index] > 0 && this.movePixel[index - 1] === 0) {
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


      if (this.state.pos[index] >= 0) {
        if (this.state.introItemInfo) {
          if (!firstLap) {
            adjustedPos = -this.boxHeight + this.props.height;
            firstLap = true;
          }
        } else {
          adjustedPos = -this.boxHeight;
        }
        this.setState({
          pos: this.state.pos.map((v, i) => {
            if (i === index) {
              return adjustedPos;
            } else {
              return v;
            }
          }),
        });
        next = undefined;
        pos = adjustedPos;
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

  private reset = (): void => {
    if (this.state.animationState) {
      return;
    }
    const shufflePos: ItemInfo[][] = [];

    this.state.itemInfo.forEach((eachPos) => {
      shufflePos.push(this.shuffle(eachPos));
    });

    this.setState({
      itemInfo: shufflePos,
      reset: false,
      pos: [...new Array(this.props.row)].map(() => (-this.boxHeight)),
      eachAnimationState: [...new Array(this.props.row)].map(() => (false))
    });
  }
}

