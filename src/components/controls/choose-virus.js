import React from "react";
import Radium from "radium";
import { datasets } from "../../util/globals";
import ChooseVirusSelect from "./choose-virus-select";
import parseParams from "../../util/parseParams";

/* not sure if these functions are necessary, really. If so, i'll
move them to util/urlHelpers.js
*/
// remove starting or trailing slashes from path
const tidyUpPathname = function (pathname) {
  const tmppath = pathname[0] === "/" ? pathname.substring(1) : pathname;
  return tmppath[tmppath.length - 1] === "/"
         ? tmppath.substring(0, tmppath.length - 1)
         : tmppath;
};

@Radium
class ChooseVirus extends React.Component {
  constructor(props) {
    super(props);
  }
  // static propTypes = {
  // }
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  getStyles() {
    return { base: {} };
  }

  render() {
    const styles = this.getStyles();
    const pathname = this.context.router.location.pathname;
    /* analyse the current route in order to adjust the dataset selection choices.
    paramFields is an object with keys "virus" and potentially "lineage" and "duration"
    as well */
    const paramFields = parseParams(tidyUpPathname(pathname)).dataset;
    // names of the different selectors in the current hierarchy: [virus, lineage, duration]
    // there will be (fields.length) dropdown boxes
    const fields = Object.keys(paramFields).sort((a, b) => paramFields[a][0] > paramFields[b][0]);
    // the current choice, e.g. [flu, h3n2, 3y] or [zika]
    const choices = fields.map((d) => paramFields[d][1]);
    /* make a selector for each of the fields. I.e. if it's only "zika", then the
    selectors array will only have 1 element */
    const selectors = [];   // list to contain the different data set selectors
    let level = datasets;   // pointer used to move through the hierarchy -- currently at the top level of datasets
    for (let vi = 0; vi < fields.length; vi++) {
      if (choices[vi]) {
        // pull options from the current level of the dataset hierarchy, ignore 'default'
        const options = Object.keys(level[fields[vi]]).filter((d) => d !== "default");
        selectors.push((
          <div key={vi} style={[styles.base]}>
            <ChooseVirusSelect
              title={"Choose " + fields[vi]}
              choice_tree={choices.slice(0, vi)}
              selected = {choices[vi]}
              options={options}
            />
          </div>
          ));
        // move to the next level in the data set hierarchy
        level = level[fields[vi]][choices[vi]];
      }
    }
    // return a list of selectors in the order of the data set hierarchy
    return (
      <div>
        {selectors}
      </div>
    );
  }
}

export default ChooseVirus;
