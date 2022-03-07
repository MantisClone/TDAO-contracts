import Arweave from "arweave";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Since v1.5.1 you're now able to call the init function for the web version without options. The current URL path will be used by default. This is recommended when running from a gateway.
const arweave = Arweave.init({
  host: "arweave.net",
  port: 1984,
  protocol: "http",
});

let arAddress;
let walletKey;

async function generateWalletKey() {
  walletKey = await arweave.wallets.generate();
  console.log(walletKey);
}
// todo: get the wallet address working... faack
async function getWalletAddress(key) {
  await arweave.wallets.jwkToAddress(key).then(address => {
    console.log(address);
    //1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY
    arAddress = address;
  });
}

arweave.network.getInfo().then(console.log);

generateWalletKey();
// getWalletAddress(walletKey);

// demo wallet
arweave.wallets.getBalance("1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY").then(balance => {
  let winston = balance;
  let ar = arweave.ar.winstonToAr(balance);

  console.log("Winston: ", winston);
  //125213858712

  console.log("AR: ", ar);
  //0.125213858712
});

let transactionA = arweave
  .createTransaction(
    {
      data: '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>',
    },
    walletKey,
  )
  .then(x => console.log(x));

// ! doesn't work
// transactionA.addTag("Content-Type", "text/html");
// transactionA.addTag("key2", "value2");

// arweave.transactions.sign(transactionA, walletKey);

// let uploader = arweave.transactions.getUploader(transactionA);

// while (!uploader.isComplete) {
//   uploader.uploadChunk();
//   console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
// }

const Submit = async ({ address }) => {
  const manuscriptFileLabel = "manuscript-label";
  const thumbnailFileLabel = "thumbnail-label";
  const [selectedManuscriptFile, setSelectedManuscriptFile] = useState(null);
  const [authors, setAuthors] = useState("");
  const [selectedArticleCover, setSelectedArticleCover] = useState();
  const [talentPrice, setTalentPrice] = useState(0);
  const [articleTitle, setArticleTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [blockchain, setBlockchain] = useState("Ethereum");
  const [categories, setCategories] = useState([]);
  const [optionTech, setOptionTech] = useState(false);
  const [optionHistory, setOptionHistory] = useState(false);
  const [optionRomance, setOptionRomance] = useState(false);
  const [optionComedy, setOptionComedy] = useState(false);
  const [optionPolitics, setOptionPolitics] = useState(false);
  const { walletId } = useParams();

  const changeSelectedManuscriptFile = event => {
    setSelectedManuscriptFile(event.target.files[0]);
  };

  const changeTalentPrice = event => {
    setTalentPrice(event.target.value);
  };

  const changeBlockchain = e => {
    setBlockchain(e.target.value);
  };

  const changeSelectedArticleCover = event => {
    setSelectedArticleCover(event.target.files[0]);
    console.log(selectedArticleCover);
  };

  const changeArticleTitle = event => {
    setArticleTitle(event.target.value);
  };

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const changeCategories = event => {
    console.log(event.target.value);
    var options = event.target.options;
    var categoriesSelected = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        categoriesSelected.push(options[i].value);
      }
    }
    setCategories(categoriesSelected);
  };

  const onSubmit = async () => {
    const server = "http://localhost:4000";

    const articleFile = {
      filename: selectedManuscriptFile.name,
      data: selectedManuscriptFile ? await toBase64(selectedManuscriptFile) : "",
    };
    const articleCover = {
      filename: selectedArticleCover.name,
      data: selectedArticleCover ? await toBase64(selectedArticleCover) : "",
    };

    let articleCategories = "";
    if (optionTech) articleCategories += "Technology,";
    if (optionHistory) articleCategories += "History,";
    if (optionRomance) articleCategories += "Romance,";
    if (optionComedy) articleCategories += "Comedy,";
    if (optionPolitics) articleCategories += "Politics";

    try {
      const res = await axios.post(server + "/api/article", {
        walletId: walletId,
        body: articleFile,
        cover: articleCover,
        price: talentPrice,
        title: articleTitle,
        authors: authors,
        abstract: abstract,
        blockchain: blockchain,
        categories: articleCategories,
      });
      console.log("res", res);
    } catch (e) {
      console.log(e);
    }
    // todo: set up Arweave tx
    submitToArweave();

    // todo: set up onchain tx
    submitOnChain();
  };

  const submitToArweave = async () => {};

  const submitOnChain = async () => {};

  useEffect(() => {
    if (!selectedArticleCover) return;
    var src = URL.createObjectURL(selectedArticleCover);
    var preview = document.getElementById("preview");
    preview.src = src;
    preview.style.display = "block";
  }, [selectedArticleCover]);

  // useEffect(async() => {
  //   if(!selectedManuscriptFile || selectedManuscriptFile === undefined) return;
  //   const data = await toBase64(selectedManuscriptFile);

  //   console.log('filedata', data);
  // }, [selectedManuscriptFile])

  return (
    <div className="" style={{ backgroundImage: "linear-gradient(#fff, #EEEE" }}>
      <div className="m-4 p-4 max-w-screen-lg lg:max-w-screen-xl mx-auto">
        <div>
          <h2 className="text-4xl font-bold text-left">Submit Article</h2>
          <p className="text-left">
            Upload your article manuscript and related details to the Journal of Decentralized Work.
          </p>
        </div>

        <div className="flex">
          <div className="flex-1 space-y-6">
            <div className="space-y-6">
              <div className="py-5 sm:rounded-lg">
                <div className="md:grid md:grid-cols-10 md:gap-6">
                  <div className="mt-5 md:mt-0 md:col-span-6 flex flex-col place-content-between">
                    <label className="block text-left text-lg font-bold text-gray-700">Article Manuscript</label>
                    <div className="mt-1 h-full flex flex-col justify-center items-center px-6 pt-5 pb-6 border border-gray-300 rounded-md">
                      {selectedManuscriptFile ? (
                        <div className="py-5 text-lg text-lightgray">{selectedManuscriptFile.name}</div>
                      ) : (
                        <div className="py-5 text-lg text-lightgray">File formats: pdf, md, doc, docx, txt.</div>
                      )}
                      <label
                        htmlFor="manuscript-upload"
                        className="w-56 py-2 font-bold text-sm text-primary rounded-full cursor-pointer"
                        style={{ backgroundColor: "#FFD6DA" }}
                      >
                        <span>Choose File</span>
                        <input
                          accept=".pdf, .md, .doc, .docx, .txt"
                          id="manuscript-upload"
                          name="manuscript-upload"
                          type="file"
                          className="sr-only"
                          onChange={changeSelectedManuscriptFile}
                        />
                      </label>
                    </div>
                    <div className="mt-1 h-full flex flex-col justify-center items-center px-6 pt-5 pb-6 border border-gray-300 rounded-md">
                      {selectedArticleCover ? (
                        <div className="py-5 text-lg text-lightgray">{selectedArticleCover.name}</div>
                      ) : (
                        <div className="py-5 text-lg text-lightgray">Cover Image formats: jpeg, png.</div>
                      )}
                      <label
                        htmlFor="articlecover-upload"
                        className="w-56 py-2 font-bold text-sm text-primary rounded-full cursor-pointer"
                        style={{ backgroundColor: "#FFD6DA" }}
                      >
                        <span>Choose Image</span>
                        <input
                          accept=".jpeg, .png"
                          id="articlecover-upload"
                          name="articlecover-upload"
                          type="file"
                          className="sr-only"
                          onChange={changeSelectedArticleCover}
                        />
                      </label>
                    </div>
                    <div className="mt-2">
                      <label className="block text-left text-lg font-bold">Price</label>
                      <div className="flex flex-row items-end border-b border-black ">
                        <input
                          type="number"
                          name="price"
                          id="price"
                          className="mt-1 mb-0 p-2 bg-transparent block w-full shadow-sm focus:outline-none text-lg"
                          value={talentPrice}
                          onChange={changeTalentPrice}
                        />
                        <div className="pb-2 text-lightgray text-lg">$TALENT</div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:col-span-4 md:flex flex-col">
                    <h3 className="text-left text-lg font-bold leading-6 text-gray-900">Preview</h3>
                    <div className="my-0 border border-gray-300 rounded-md w-full h-full flex items-center justify-center text-center">
                      {selectedArticleCover ? (
                        <img id="preview"></img>
                      ) : (
                        <p>Upload image to preview your article image</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-10 col-span-6">
                  <label htmlFor="article-title" className="pl-4 block text-left text-lg font-bold">
                    Title <span className="pl-1 text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="article-title"
                    id="article-title"
                    placeholder="e.g Decentralised finance"
                    value={articleTitle}
                    onChange={changeArticleTitle}
                    className="my-1 p-4 bg-transparent rounded-xl block w-full focus:outline-none text-lg border border-black"
                  />
                </div>
                <div className="mt-10 col-span-6">
                  <label htmlFor="article-title" className="pl-4 block text-left text-lg font-bold">
                    Author(s) <span className="pl-1 text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="article-title"
                    id="article-title"
                    placeholder="e.g John Doe"
                    value={authors}
                    onChange={e => setAuthors(e.target.value)}
                    className="my-1 p-4 bg-transparent rounded-xl block w-full focus:outline-none text-lg border border-black "
                  />
                </div>
                {/* <div className="mt-10 col-span-6">
                <label htmlFor="authors" className="block text-left text-sm font-medium text-gray-700">
                  Author(s)
                </label>
                <AuthorForm
                  register={register}
                  control={control}
                  handleSubmit={handleSubmit}
                  reset={reset}
                  formState={formState}
                  watch={watch}
                />
              </div> */}
                <div className="mt-10 col-span-6">
                  <div className="pl-4 flex flex-col text-left">
                    <label htmlFor="abstract" className="block text-left text-lg font-bold">
                      Abstract <span className="pl-1 text-primary">*</span>
                    </label>
                    <p>
                      Each submission should have exactly one abstract. Submissions with multiple articles will be
                      disqualified from the marketplace.
                    </p>
                  </div>
                  <div className="mt-1">
                    <textarea
                      rows={4}
                      name="abstract"
                      id="abstract"
                      value={abstract}
                      onChange={e => setAbstract(e.target.value)}
                      className="p-4 block w-full bg-transparent text-lg rounded-xl focus:outline-none border border-black"
                    />
                  </div>
                </div>

                <div className="mt-10 col-span-6">
                  <label htmlFor="select-blockchain" className="pl-4 block text-left text-lg font-bold">
                    Select Blockchain <span className="pl-4 text-primary">*</span>
                  </label>
                  <select
                    id="select-blockchain"
                    name="select-blockchain"
                    onChange={e => changeBlockchain(e)}
                    className="mt-1 block bg-transparent w-full pl-3 pr-10 py-2 text-lg rounded-xl border border-black"
                  >
                    <option>Ethereum</option>
                    <option>Bitcoin</option>
                  </select>
                </div>

                <div className="mt-10 col-span-6">
                  <div className="pl-4 flex flex-col">
                    <label htmlFor="categories" className="block text-left text-lg font-bold">
                      Categories
                    </label>
                    <p className="text-left">Select the category this article might belong to</p>
                  </div>
                  <div className="mt-1 w-full p-4 text-lg rounded-lg border flex flex-row flex-wrap items-center space-x-4">
                    <div
                      className={
                        optionTech
                          ? "my-2 px-4 py-2 rounded-full text-lg text-primary border border-primary cursor-pointer font-bold flex flex-row items-center"
                          : "my-2 px-4 py-2 rounded-full text-lg border cursor-pointer flex flex-row items-center"
                      }
                      style={
                        optionTech ? { backgroundColor: "rgba(180, 28, 46, 0.13)" } : { backgroundColor: "transparent" }
                      }
                      onClick={() => setOptionTech(!optionTech)}
                    >
                      {optionTech && (
                        <svg
                          className="mr-2"
                          width="20"
                          height="16"
                          viewBox="0 0 20 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.36364 12.3657L1.59091 7.66418L0 9.23134L6.36364 15.5L20 2.06716L18.4091 0.5L6.36364 12.3657Z"
                            fill="#B41C2E"
                          />
                        </svg>
                      )}
                      <div>Technology</div>
                    </div>
                    <div
                      className={
                        optionHistory
                          ? "my-2 px-4 py-2 rounded-full text-lg text-primary border border-primary cursor-pointer font-bold flex flex-row items-center"
                          : "my-2 px-4 py-2 rounded-full text-lg border cursor-pointer flex flex-row items-center"
                      }
                      style={
                        optionHistory
                          ? { backgroundColor: "rgba(180, 28, 46, 0.13)" }
                          : { backgroundColor: "transparent" }
                      }
                      onClick={() => setOptionHistory(!optionHistory)}
                    >
                      {optionHistory && (
                        <svg
                          className="mr-2"
                          width="20"
                          height="16"
                          viewBox="0 0 20 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.36364 12.3657L1.59091 7.66418L0 9.23134L6.36364 15.5L20 2.06716L18.4091 0.5L6.36364 12.3657Z"
                            fill="#B41C2E"
                          />
                        </svg>
                      )}
                      <div>History</div>
                    </div>
                    <div
                      className={
                        optionRomance
                          ? "my-2 px-4 py-2 rounded-full text-lg text-primary border border-primary cursor-pointer font-bold flex flex-row items-center"
                          : "my-2 px-4 py-2 rounded-full text-lg border cursor-pointer flex flex-row items-center"
                      }
                      style={
                        optionRomance
                          ? { backgroundColor: "rgba(180, 28, 46, 0.13)" }
                          : { backgroundColor: "transparent" }
                      }
                      onClick={() => setOptionRomance(!optionRomance)}
                    >
                      {optionRomance && (
                        <svg
                          className="mr-2"
                          width="20"
                          height="16"
                          viewBox="0 0 20 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.36364 12.3657L1.59091 7.66418L0 9.23134L6.36364 15.5L20 2.06716L18.4091 0.5L6.36364 12.3657Z"
                            fill="#B41C2E"
                          />
                        </svg>
                      )}
                      <div>Romance</div>
                    </div>
                    <div
                      className={
                        optionComedy
                          ? "my-2 px-4 py-2 rounded-full text-lg text-primary border border-primary cursor-pointer font-bold flex flex-row items-center"
                          : "my-2 px-4 py-2 rounded-full text-lg border cursor-pointer flex flex-row items-center"
                      }
                      style={
                        optionComedy
                          ? { backgroundColor: "rgba(180, 28, 46, 0.13)" }
                          : { backgroundColor: "transparent" }
                      }
                      onClick={() => setOptionComedy(!optionComedy)}
                    >
                      {optionComedy && (
                        <svg
                          className="mr-2"
                          width="20"
                          height="16"
                          viewBox="0 0 20 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.36364 12.3657L1.59091 7.66418L0 9.23134L6.36364 15.5L20 2.06716L18.4091 0.5L6.36364 12.3657Z"
                            fill="#B41C2E"
                          />
                        </svg>
                      )}
                      <div>Comedy</div>
                    </div>
                    <div
                      className={
                        optionPolitics
                          ? "my-2 px-4 py-2 rounded-full text-lg text-primary border border-primary cursor-pointer font-bold flex flex-row items-center"
                          : "my-2 px-4 py-2 rounded-full text-lg border cursor-pointer flex flex-row items-center"
                      }
                      style={
                        optionPolitics
                          ? { backgroundColor: "rgba(180, 28, 46, 0.13)" }
                          : { backgroundColor: "transparent" }
                      }
                      onClick={() => setOptionPolitics(!optionPolitics)}
                    >
                      {optionPolitics && (
                        <svg
                          className="mr-2"
                          width="20"
                          height="16"
                          viewBox="0 0 20 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.36364 12.3657L1.59091 7.66418L0 9.23134L6.36364 15.5L20 2.06716L18.4091 0.5L6.36364 12.3657Z"
                            fill="#B41C2E"
                          />
                        </svg>
                      )}
                      <div>Politics</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={onSubmit}
                  className="bg-primary text-white py-2 px-6 rounded-full text-lg"
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submit;
