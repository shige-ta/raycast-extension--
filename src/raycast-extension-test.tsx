// エラーあり！！！
// news  rss取得
import { Action, ActionPanel, List, open } from "@raycast/api";
import { useEffect, useState } from "react";
import { useFetch } from "@raycast/utils";
import { XMLParser } from "fast-xml-parser";
import Parser from "rss-parser";
import axios, { AxiosError, AxiosResponse } from "axios";
import got from "got";

const options = {
  ignoreAttributes: true,
};
interface State {
  items?: Parser.Item[];
  items_hatena?: Parser.Item[];
  error?: Error;
  yahoo_json?: any;
  yahoo_json_ente?: any;
  yahoo_json_busi?: any;
  yahoo_json_it?: any;
  yahoo_json_sci?: any;
}

export default function Command() {
  const [state, setState] = useState<State>({});

  useEffect(() => {
    async function fetchStories() {
      const options = {
        ignoreAttributes: true,
      };

      const parser = new Parser();
      const feed = await parser.parseURL(
        "https://b.hatena.ne.jp/hotentry/it.rss"
      );
      const parser_hatena = new Parser();
      let feed_hatena = await parser_hatena.parseURL(
        "https://b.hatena.ne.jp/hotentry/it.rss"
      );

      const parser_yahoo = new XMLParser(options);

      const res = await got(
        "https://news.yahoo.co.jp/rss/topics/top-picks.xml"
      ); // レスポンスが返ってこないエラーを再現するため、不正なポートを利用
      const json = parser_yahoo.parse(res.body).rss;
      // const json = res.body;

      const enta = await got(
        "https://news.yahoo.co.jp/rss/topics/entertainment.xml"
      ); // レスポンスが返ってこないエラーを再現するため、不正なポートを利用
      const json_enter = parser_yahoo.parse(enta.body).rss;
      // const json_enter = enta.body;

      const busi = await got(
        "https://news.yahoo.co.jp/rss/topics/business.xml"
      ); // レスポンスが返ってこないエラーを再現するため、不正なポートを利用
      const json_busi = parser_yahoo.parse(busi.body).rss;
      // const json_busi = busi.body;

      const it = await got("https://news.yahoo.co.jp/rss/topics/it.xml"); // レスポンスが返ってこないエラーを再現するため、不正なポートを利用
      const json_it = parser_yahoo.parse(it.body).rss;
      // const json_it = it.body;

      const sci = await got("https://news.yahoo.co.jp/rss/topics/science.xml"); // レスポンスが返ってこないエラーを再現するため、不正なポートを利用
      const json_sci = parser_yahoo.parse(sci.body).rss;
      // const json_sci = sci.body;

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
              {(state.items || [])?.map((item2) => (
                <Action
                  title={item2["title"]}
                  onAction={() => open(item2["link"])}
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
              {(state.items_hatena || [])?.map((item) => (
                <Action
                  title={item["title"]}
                  onAction={() => open(item["link"])}
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
              {(state.yahoo_json || [])?.map((item) => (
                <Action
                  title={item["title"]}
                  onAction={() => open(item["link"])}
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
              {(state.yahoo_json_ente || [])?.map((item) => (
                <Action
                  title={item["title"]}
                  onAction={() => open(item["link"])}
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
              {(state.yahoo_json_busi || [])?.map((item) => (
                <Action
                  title={item["title"]}
                  onAction={() => open(item["link"])}
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
              {(state.yahoo_json_it || [])?.map((item) => (
                <Action
                  title={item["title"]}
                  onAction={() => open(item["link"])}
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
              {(state.yahoo_json_sci || [])?.map((item) => (
                <Action
                  title={item["title"]}
                  onAction={() => open(item["link"])}
                />
              ))}
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
    </List>
  );
}
