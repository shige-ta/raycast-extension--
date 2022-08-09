// エラーあり！！！
// news  rss取得
import { Action, ActionPanel, List, open } from "@raycast/api";
import { useEffect, useState } from "react";
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
  yahoo_json_ente?: string[];
  yahoo_json_busi?: string[];
  yahoo_json_it?: string[];
  yahoo_json_sci?: string[];
}

export default function Command() {
  const [state, setState] = useState<State>({});

  useEffect(() => {
    async function fetchStories() {
      const options = {
        ignoreAttributes: true,
      };

      const parser = new Parser();
      const feed: string[] = await parser.parseURL(
        "https://b.hatena.ne.jp/hotentry/it.rss"
      );
      const parser_hatena = new Parser();
      let feed_hatena: string[] = await parser_hatena.parseURL(
        "https://b.hatena.ne.jp/hotentry/it.rss"
      );

      const parser_yahoo = new XMLParser(options);

      const res: string[] = await got(
        "https://news.yahoo.co.jp/rss/topics/top-picks.xml"
      );
      const json: string[] = parser_yahoo.parse(res.body).rss;

      const enta: string[] = await got(
        "https://news.yahoo.co.jp/rss/topics/entertainment.xml"
      );
      const json_enter: string[] = parser_yahoo.parse(enta.body).rss;

      const busi: string[] = await got(
        "https://news.yahoo.co.jp/rss/topics/business.xml"
      );
      const json_busi: string[] = parser_yahoo.parse(busi.body).rss;

      const it: string[] = await got(
        "https://news.yahoo.co.jp/rss/topics/it.xml"
      );
      const json_it: string[] = parser_yahoo.parse(it.body).rss;

      const sci: string[] = await got(
        "https://news.yahoo.co.jp/rss/topics/science.xml"
      );
      const json_sci: string[] = parser_yahoo.parse(sci.body).rss;

      setState({
        items: feed.items,
        items_hatena: feed_hatena.items,
        yahoo_json: json.channel.item,
        yahoo_json_ente: json_enter.channel.item,
        yahoo_json_busi: json_busi.channel.item,
        yahoo_json_it: json_it.channel.item,
        yahoo_json_sci: json_sci.channel.item,
      });
    }
    fetchStories();
  }, []);

  return (
    <List>
      <List.Item
        title="menthas"
        actions={
          <ActionPanel title="menu">
            <ActionPanel.Submenu title="menthas">
              {(state.items || [])?.map((item, index) => (
                <Action
                  key={index}
                  title={item.title}
                  onAction={() => open(item.link)}
                />
              ))}
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
      <List.Item
        title="hatenabu"
        actions={
          <ActionPanel title="menu">
            <ActionPanel.Submenu title="hatenabu">
              {(state.items_hatena || [])?.map((item, index) => (
                <Action
                  key={index}
                  title={item.title}
                  onAction={() => open(item.link)}
                />
              ))}
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
      <List.Item
        title="yahoo news"
        actions={
          <ActionPanel title="menu">
            <ActionPanel.Submenu title="yahoo news">
              {(state.yahoo_json || [])?.map((item, index) => (
                <Action
                  key={index}
                  title={item.title}
                  onAction={() => open(item.link)}
                />
              ))}
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
      <List.Item
        title="yahoo news(エンタメ)"
        actions={
          <ActionPanel title="menu">
            <ActionPanel.Submenu title="yahoo news(エンタメ)">
              {(state.yahoo_json_ente || [])?.map((item, index) => (
                <Action
                  key={index}
                  title={item.title}
                  onAction={() => open(item.link)}
                />
              ))}
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
      <List.Item
        title="yahoo news(経済)"
        actions={
          <ActionPanel title="menu">
            <ActionPanel.Submenu title="yahoo news(経済)">
              {(state.yahoo_json_busi || [])?.map((item, index) => (
                <Action
                  key={index}
                  title={item.title}
                  onAction={() => open(item.link)}
                />
              ))}
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
      <List.Item
        title="yahoo news(IT)"
        actions={
          <ActionPanel title="menu">
            <ActionPanel.Submenu title="yahoo news(IT)">
              {(state.yahoo_json_it || [])?.map((item, index) => (
                <Action
                  key={index}
                  title={item.title}
                  onAction={() => open(item.link)}
                />
              ))}
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
      <List.Item
        title="yahoo news(科学)"
        actions={
          <ActionPanel title="menu">
            <ActionPanel.Submenu title="yahoo news(科学)">
              {(state.yahoo_json_sci || [])?.map((item, index) => (
                <Action
                  key={index}
                  title={item.title}
                  onAction={() => open(item.link)}
                />
              ))}
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
    </List>
  );
}
