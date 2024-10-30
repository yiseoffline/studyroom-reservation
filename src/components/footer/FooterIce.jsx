import React from 'react';
import './Footer.css';

const FooterIce = () => {
  return (
    <div className="w-full">
      <footer
        id="footer"
        className="text-sm bg-footermainbg relative p-0 block break-keep">
        <div className="py-6 px-2.7 ml-5 mr-5">
          <div className="footer-logo cursor-pointer">
            <a href="https://www.hufs.ac.kr/">
              <img
                className="w-50 h-10"
                src="https://computer.hufs.ac.kr/sites/computer/masterSkin/computer_JW_MS_K2WT001_M/images/logo_footer.svg"
                alt="한국외국어대학교"
              />
            </a>
          </div>
          <div className="mt-5 leading-8 text-footertextcolor">
            <p className="block mx-0 leading-2">
              <span className="text-sm inline-block font-normal">
                <b className="font-bormal text-footertextbrown">
                  글로벌캠퍼스{' '}
                </b>
                17035 경기도 용인시 처인구 모현읍 외대로 81 한국외국어대학교
                글로벌캠퍼스 (공학관 204-1호)
              </span>
            </p>
            <p className="block  mx-0 leading-2">
              <span className="inline-block font-normal">
                <b className="font-bormal text-footertextbrown">TEL. </b>
                031-330-4255
              </span>
              <span>
                <b className="font-bormal text-footertextbrown"> Email. </b>
                <a href="mailto:ces@hufs.ac.kr">ice@hufs.ac.kr</a>
              </span>
            </p>
            <p className="block leading-2">
              <span>
                <b className="font-bormal text-footertextbrown">
                  학부 홈페이지.{' '}
                </b>
                <a
                  className="inline hover:underline"
                  href="https://ice.hufs.ac.kr">
                  https://ice.hufs.ac.kr
                </a>
              </span>
            </p>
            <div className="inline hover:underline cursor-pointer text-gray-400 text-sm mt-3">
              관리자
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterIce;
