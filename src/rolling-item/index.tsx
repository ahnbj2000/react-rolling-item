import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as styles from './rolling-item.scss';
import classNames from 'classnames';

interface IRollingItemProps {

}

interface IRollingItemState {

}

export default class RollingItem extends React.PureComponent<IRollingItemProps, IRollingItemState> {
  /* tslint:disable:no-console */
  constructor(props: IRollingItemProps, context?: any) {
    super(props, context);
  }

  public componentDidMount(): void {
    // lcs.loadNClicks(Naver.NSC_PAPAGO_GYM);
  }

  public componentWillReceiveProps(nextProps: IRollingItemProps, nextState: IRollingItemState): void {

  }

  public render(): React.ReactNode {

    return (
      <div className={styles.machine_rolling}>
        <div className={styles.rolling_inner}>
          <div className={styles.rolling_box}>
            <div style={{ transform: 'translateY(-84px)'}}>
              <div className={styles.rolling_papago_01}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_02}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_03}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_04}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_05}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_06}>
                <div className={styles.rooling_gif_img}/>
              </div>
            </div>
          </div>

          <div className={styles.rolling_box}>
            <div>
              <div className={styles.rolling_papago_01}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_02}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_03}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_04}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_05}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_06}>
                <div className={styles.rooling_gif_img}/>
              </div>
            </div>
          </div>

          <div className={styles.rolling_box}>
            <div>
              <div className={styles.rolling_papago_01}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_02}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_03}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_04}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_05}>
                <div className={styles.rooling_gif_img}/>
              </div>
              <div className={styles.rolling_papago_06}>
                <div className={styles.rooling_gif_img}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

