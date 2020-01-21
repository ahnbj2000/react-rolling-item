import * as React from 'react';
import styles from '../styles/rolling-item.module.scss';
import styled, { css, keyframes } from 'styled-components';
import { detect } from 'detect-browser';
import classNames from 'classnames';

type IntroItemInfo = {x: string | number, y: string | number};
interface ItemInfo extends IntroItemInfo {id?: any, probability?: number};
interface IRollingItemProps {
  on: boolean;
  column: number;
  backgroundImage: string;
  backgroundSize: string;
  itemInfo: ItemInfo[];
  introItemInfo: IntroItemInfo;
  width: number;
  height: number;
  fixedIds: any[];
  startDelay?: number;
  reset?: boolean;
  completionAnimation?: boolean;
  rootClassName?: string;
  onProgress?: (progress: boolean, result?: any[]) => void;
}

interface IRollingItemState {
  on: boolean;
  animationState: boolean;
  eachAnimationState: boolean[];
  pos: number[];
  itemInfo: ItemInfo[][];
  reset: boolean;
}

const RAF_DELAY = 10;

const translateProp: any = (value: number) => {
  const browserInfo: any = detect();

  if (browserInfo.name === 'ie' && parseInt(browserInfo.version, 10) === 9) {
    return `translate(0, ${value}px)`;
  } else {
    return `translate3d(0, ${value}px, 0)`;
  }
}

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
    transform: translateProp(props.pos),
    WebkitTransform: translateProp(props.pos),
  }
}))`
  ${(props: any) => css`animation: ${props.framePos && keyframeProp(props.framePos)} 0.6s ease-out 1`};
`;

const RollingImages: any = styled.div<any>`
  background: url(${props => props.backgroundImage});
  background-size: ${props => props.backgroundSize};
  background-position: ${props => typeof props.pos.x === 'number' ? `${props.pos.x}px` : props.pos.x} ${props => typeof props.pos.y === 'number' ? `${props.pos.y}px` : props.pos.y};
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
`;

const keyframeProp: any = (props: any) => keyframes`
  50% { transform: ${translateProp(props + 20)}; }
  100% { transform: ${translateProp(props)}; }
`
export default class RollingItem extends React.PureComponent<IRollingItemProps, IRollingItemState> {
  private rollingRafId: any[] = [];
  private loopRafId: any = null;
  private boxHeight: number = 0;
  private movePixel: number[] = [];
  private stopDelay: number[] = [];
  private resultId: any[] = [];
  private generatedItems: any[] = [];
  private pickedItem: any;
  private prizeItemIndexes: any[] = [];
  private browserInfo: any;
  private isMount: boolean = false;

  static getDerivedStateFromProps(props: IRollingItemProps, state: IRollingItemState) {
    if (state.pos.length === 0) {
      return {
        pos: [...new Array(props.column)].map(() => (-(props.height * props.itemInfo.length))),
        itemInfo: [...new Array(props.column)].map((v, i) => {
          let probabilitySum = 0;
          let isOver100 = false;
          const itemInfo = [...props.itemInfo].map((item, i) => {
            if (typeof item.probability !== 'undefined') {
              probabilitySum += item.probability;
              if (probabilitySum > 100 && !isOver100) {
                item.probability = probabilitySum - 100;
                isOver100 = true;
                return item;
              }
              if (isOver100) {
                item.probability = 0;
              }
            }
            if (typeof item.id === 'undefined') {
              item.id = i;
            }
            return item;
          });
          return itemInfo;
        }),
      };
    }

    if (props.on !== state.on) {
      return {
        on: props.on && !state.animationState,
      }
    }

    if (props.reset !== state.reset) {
      return {
        reset: props.reset && !state.animationState,
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
      eachAnimationState: [...new Array(props.column)].map(() => (false)),
      pos: [],
      itemInfo: [],
      reset: false,
    }
    this.browserInfo = detect();
  }

  public componentDidMount(): void {
    this.isMount = true;
    this.boxHeight = this.props.height * (this.state.itemInfo[0].length + (!!this.props.introItemInfo && 1));

    this.reset();
  }

  public componentWillUnmount(): void {
    this.isMount = false;
    this.destroy();
  }

  public componentDidUpdate(prevProps: IRollingItemProps, prevState: IRollingItemState): void {
    const { on, reset } = this.state;

    if (prevState.on !== on && on) {
      this.setState({
        animationState: true,
        pos: [...new Array(this.props.column)].map(() => (-this.boxHeight)),
        eachAnimationState: [...new Array(this.props.column)].map(() => (false))
      });

      let execCount = 0;
      const callback = (next?: any) => {
        if (!this.isMount) {
          this.destroy();
          return;
        }
        let now = new Date().getTime();
        if (typeof next === 'undefined' || (now > next && execCount < this.props.column)) {
          this.stopDelay[execCount] = execCount === 0 ? 0 : 3;
          this.cancel(execCount);
          this.movePixel[execCount] = Math.floor((this.browserInfo.name === 'ie' && parseInt(this.browserInfo.version, 10) === 9 ? 20 : 15) * this.props.height * 0.01);
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
    const { backgroundImage, backgroundSize, width, height, introItemInfo, completionAnimation = false , rootClassName = ''} = this.props;
    const { itemInfo, eachAnimationState, pos } = this.state;
    const rollingBoxes: any[] = [];

    itemInfo.forEach((eachPos, i) => {
      let framePos = eachAnimationState[i] && completionAnimation ? pos[i] : null;

      rollingBoxes.push(
        <RollingBox className={classNames(styles.box, 'roll_box_item')} {...{ width, height }} key={i}>
          <BoxDiv
            className={"roll_box_img_wrap"}
            { ...{ pos: this.state.pos[i], framePos } }
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
      <div className={classNames(styles.rolling, rootClassName, 'roll_box_wrap')}>
        <div className={classNames(styles.inner, 'roll_box_inner')}>
          {rollingBoxes}
        </div>
      </div>
    );
  }

  private shuffle = (pos: ItemInfo[]): ItemInfo[] => {
    const shufflePos = [...pos];

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
    const itemNum = this.props.itemInfo.length;

    const callback = (next?: any) => {
      if (!this.isMount) {
        this.destroy();
        return;
      }
      let now = new Date().getTime();
      const fitPos = Math.abs(this.state.pos[index]) % this.props.height;

      if (!this.state.on) {
        if (index === 0 || this.movePixel[index - 1] === 0) {
          if (this.generatedItems.length > 0 || this.prizeItemIndexes.length > 0) {
            let currentIndex = Math.floor(Math.abs(this.state.pos[index]) / this.props.height);

            if (itemNum === currentIndex) {
              currentIndex = 0;
            }

            if (this.movePixel[index] > 15) {
              this.movePixel[index]--;
            }

            if (fitPos <= this.movePixel[index] && fitPos > 0 && currentIndex === this.prizeItemIndexes[index]) {
                this.movePixel[index] = fitPos;
            }

            if (fitPos === 0 && currentIndex === this.prizeItemIndexes[index]) {
              this.movePixel[index] = 0;
            }
          } else {
            if (fitPos === 0 && this.stopDelay[index] === 0) {
              this.movePixel[index] = 0;
            } else {
              if (this.movePixel[index] > 15) {
                this.movePixel[index]--;
              }
            }
          }

          if (this.stopDelay[index] > 0) {
            this.stopDelay[index]--;
          }
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
        if (this.props.introItemInfo) {
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
            this.resultId[index] = typeof selectedItem.id !== 'undefined' ? selectedItem.id : i;
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

  private generatedByProbability = () => {
    const { itemInfo, column } = this.props;

    this.generatedItems = [];

    if (!itemInfo.some((item) => (typeof item.probability !== 'undefined'))) {
      return;
    }

    const totalCaseNum = Math.pow(itemInfo.length, column);
    let eachCaseNum = 0;

    itemInfo.forEach((item: ItemInfo, index) => {
      if (typeof item.probability !== 'undefined') {
        eachCaseNum = Math.floor(totalCaseNum * item.probability * 0.01);

        for (let i = 0; i < eachCaseNum; i++) {
          this.generatedItems.push(typeof item.id !== 'undefined' ? item.id : index);
        }
      }
    });

    while (totalCaseNum > this.generatedItems.length) {
      this.generatedItems.push(null);
    }
  }

  private getPickedItem = () => {
    if (this.generatedItems.length === 0) {
      return;
    }

    const { itemInfo, column } = this.props;
    const totalCaseNum = Math.pow(itemInfo.length, column);

    return this.generatedItems[Math.floor(Math.random() * (totalCaseNum + 1))];
  }

  private destroy = (): void => {
    this.rollingRafId.forEach((ids, i) => {
      this.cancel(i);
    });
    cancelAnimationFrame(this.loopRafId);

    this.loopRafId = null;
  }

  private cancel = (index: number): void => {
    cancelAnimationFrame(this.rollingRafId[index]);
    this.rollingRafId.splice(index, 1, null);
  }

  private reset = (): void => {
    if (this.state.animationState) {
      return;
    }

    this.generatedByProbability();
    this.pickedItem = this.getPickedItem();

    const shufflePos: ItemInfo[][] = [];
    const loserItem: any[] = [];

    this.state.itemInfo.forEach((eachPos, i) => {
      const shuffleItem = this.shuffle(eachPos);

      shuffleItem.some((item, index) => {
        this.prizeItemIndexes[i] = index;

        if (this.props.fixedIds) {
          return item.id === this.props.fixedIds[i];
        } else {
          if (this.generatedItems.length > 0) {
            return item.id === this.pickedItem;
          } else {
            if (i > 0) {
              const hasNotItem = loserItem.indexOf(item.id) === -1;

              if (hasNotItem) {
                loserItem.push(item.id);
                return true;
              }
              return false;
            } else {
              loserItem.push(item.id);
              return true;
            }
          }
        }
      });

      shufflePos.push(shuffleItem);
    });

    this.setState({
      itemInfo: shufflePos,
      reset: false,
      pos: [...new Array(this.props.column)].map(() => (-this.boxHeight)),
      eachAnimationState: [...new Array(this.props.column)].map(() => (false))
    });
  }

  private isAllValuesSame = (arr: any[]): boolean => {
    if (arr.length === 0) {
      return false;
    }

    const arrTemp = [...arr];
    const prevValue = arrTemp.shift();

    if (arr.length === 1 && (prevValue === arr[0])) {
      return true;
    }

    if (prevValue === arrTemp[0]) {
      return this.isAllValuesSame(arrTemp);
    } else {
      return false;
    }
  }
}

