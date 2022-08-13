// エラーあり！！！
// news  rss取得
import {
  Action,
  ActionPanel,
  List,
  open,
  Icon,
  useNavigation,
  Form,
} from "@raycast/api";
import { useEffect, useState } from "react";
import React, { useContext } from "react";
// import { useFetch } from "@raycast/utils";
import { XMLParser } from "fast-xml-parser";
import Parser from "rss-parser";
import got from "got";

const options = {
  ignoreAttributes: true,
};
interface State {
  items?: Parser.Item[];
  items_hatena?: Parser.Item[];
  error?: Error;
  yahoo_json?: string[];
  add_news_list?: string[];
}

let url_list = [
  ["https://news.yahoo.co.jp/rss/topics/top-picks.xml", "top picks"],
  ["https://news.yahoo.co.jp/rss/topics/science.xml", "yahoo science"],
  [
    "https://news.yahoo.co.jp/rss/topics/entertainment.xml",
    "yahoo entertainment",
  ],
  ["https://news.yahoo.co.jp/rss/topics/it.xml", "yahoo it"],
  ["https://news.yahoo.co.jp/rss/topics/business.xml", "yahoo business"],
  ["https://b.hatena.ne.jp/hotentry/it.rss", "hatebu it"],
  ["https://menthas.com/all/rss", "menthas"],
];

let list_url = React.createContext(url_list);

function News(p) {
  const { list, setList } = useState;
  console.log(props.url_list);

  useEffect(() => {
    async function fetchStories() {
      const opt: any = {
        ignoreAttributes: true,
      };
      const parser_yahoo = new XMLParser(opt);

      const r: any = await got(p.props);
      let items: string[] = [];
      let json: string[] = parser_yahoo.parse(r.body).rss;
      if (json === undefined) {
        const parser = new Parser();
        json = await parser.parseURL(p.props);
        items = json.items;
      } else {
        items = json.channel.item;
      }

      setState({
        news_json: items,
      });
    }
    fetchStories();
  }, []);

  return (
    <List>
      {(state.news_json || [])?.map((item, index) => (
        <List.Item
          key={index}
          title={item.title}
          onAction={() => open(item.link)}
        />
      ))}
    </List>
  );
}

function Add(props) {
  let l_url2 = useContext(list_url);
  console.log(l_url2);
  const { name, setName } = useState<string>();
  const [list, setList] = useState([]);
  let copyList = [...list];
  async function url_check(url) {
    console.log(url);
    const opt: any = {
      ignoreAttributes: true,
    };
    const parser_yahoo = new XMLParser(opt);

    try {
      const r: any = await got(url);
      let items: string[] = [];
      let json: string[] = parser_yahoo.parse(r.body).rss;
      if (json === undefined) {
        const parser
        
         = new Parser();
        json = await parser.parseURL(url);
        items = json.items;
      } else {
        items = json.channel.item;
      }
      if (items != undefined) {
        // copyList.push(url);
        // console.log(copyList);
        // console.log("URL追加");
        l_url.push(url);
      }
    } catch (e) {
      console.log("URL無効");
      // props.setList(copyList);
    }
  }
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="RSS追加"
            onSubmit={(values) => url_check(values.name)}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" value={name} />
    </Form>
  );
}

export default function Command() {
  let l_url = useContext(list_url);
  console.log(l_url);
  const [state, setState] = useState<State>({});
  const { push } = useNavigation();

  return (
    <List>
      {(l_url || []).map((item, index) => (
        <List.Item
          key={index}
          title={item[1]}
          actions={
            <ActionPanel>
              <ActionPanel.Item
                title="Push"
                onAction={() => push(<News props={item[0]} />)}
              />
            </ActionPanel>
          }
        />
      ))}
      <List.Item
        title="rss add (工事中)"
        icon={Icon.Plus}
        actions={
          <ActionPanel>
            <ActionPanel.Item
              title="Push"
              onAction={() => push(<Add props={(state, setState)} />)}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
