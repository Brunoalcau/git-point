import React, {Component, PropTypes} from 'react';
import {View, ScrollView, Text, FlatList, StyleSheet} from 'react-native';
import {Card} from 'react-native-elements';

import Parse from 'parse-diff';

import ViewContainer from '../components/ViewContainer';
import DiffBlocks from '../components/DiffBlocks';
import CodeLine from '../components/CodeLine';

import config from '@config';

class PullDiff extends Component {
  renderHeader = () => {
    const filesChanged = Parse(this.props.navigation.state.params.diff);

    let lineAdditions = 0;
    let lineDeletions = 0;

    filesChanged.forEach(function(file) {
      lineAdditions = lineAdditions + file.additions;
      lineDeletions = lineDeletions + file.deletions;
    });

    return (
      <View style={styles.header}>
        <Text style={[styles.headerItem, styles.headerText]}>{`${filesChanged.length} ${filesChanged.length === 1 ? 'file' : 'files'}`}</Text>

        <DiffBlocks
          style={styles.headerItem}
          additions={lineAdditions}
          deletions={lineDeletions}
          showNumbers
        />
      </View>
    )
  };

  renderItem = ({item}) => {
    var chunks = item.chunks.map((chunk, i) => {
      return (
        <ScrollView
          automaticallyAdjustContentInsets={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <View style={{flexDirection: 'column'}}>
            <CodeLine key={i} newChunk change={{content: chunk.content}} />

            {chunk.changes.map((change, i) => (
              <CodeLine key={i} change={change} />
            ))}
          </View>
        </ScrollView>
      );
    });

    return (
      <Card
        containerStyle={styles.fileChangeContainer}
        dividerStyle={styles.dividerStyle}
      >
        <ScrollView
          style={styles.fileTitleContainer}
          automaticallyAdjustContentInsets={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.linesChanged}>
            <Text style={[styles.codeStyle, styles.lineNumbersChanged]}>
              {item.additions + item.deletions}
            </Text>
            <DiffBlocks additions={item.additions} deletions={item.deletions} />
          </View>

          {item.new &&
            <Text style={styles.fileTitle}>
              <Text style={styles.newIndicator}>NEW{'\n'}</Text>
              <Text style={[styles.fileTitle, styles.codeStyle]}>{item.to}</Text>
            </Text>
          }

          {item.deleted &&
            <Text style={styles.fileTitle}>
              <Text style={styles.deletedIndicator}>DELETED{'\n'}</Text>
              <Text style={[styles.fileTitle, styles.codeStyle]}>{item.from}</Text>
            </Text>
          }

          {!item.new && !item.deleted &&
            <Text style={[styles.fileTitle, styles.codeStyle]}>{item.from === item.to ? item.to : `${item.from} \n → ${item.to}`}</Text>
          }
        </ScrollView>
        {item.chunks.length > 0 ? chunks : <Text style={styles.noChangesMessage}>File renamed without changes.</Text>}
      </Card>
    );
  };

  render() {
    const {navigation} = this.props;
    const filesChanged = Parse(navigation.state.params.diff);

    return (
      <ViewContainer>
        <FlatList
          ListHeaderComponent={this.renderHeader}
          removeClippedSubviews={false}
          data={filesChanged}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          disableVirtualization={true}
        />
      </ViewContainer>
    );
  }

  keyExtractor = (item, index) => {
    return index;
  };
}

PullDiff.propTypes = {
  diff: PropTypes.string,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  fileChangeContainer: {
    padding: 0,
    marginVertical: 25,
  },
  fileTitleContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    backgroundColor: config.colors.greyVeryLight,
  },
  linesChanged: {
    flex: 0.30,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineNumbersChanged: {
    fontFamily: 'Menlo',
    marginRight: 5,
  },
  fileTitle: {
    flex: 1,
    marginLeft: 10,
  },
  codeStyle: {
    fontFamily: 'Menlo',
    fontSize: 12,
  },
  dividerStyle: {
    marginBottom: 0,
  },
  noChangesMessage: {
    fontFamily: 'AvenirNext-DemiBold',
    paddingVertical: 5,
    paddingLeft: 10,
  },
  newIndicator: {
    fontFamily: 'AvenirNext-DemiBold',
    color: config.colors.green,
  },
  deletedIndicator: {
    fontFamily: 'AvenirNext-DemiBold',
    color: config.colors.red,
  },
  header: {
    paddingTop: 25,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerItem: {
    flex: 1,
  },
  headerText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 16,
  }
});

export default PullDiff;
